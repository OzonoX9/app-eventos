import Link from "next/link";
import { redirect } from "next/navigation";
import { obtenerNombreEvento } from "@/lib/eventos-config";
import { getSupabase } from "@/lib/supabase";
import { formatearFechaHora, normalizarEventoId } from "@/lib/utils";

const EVENTO_DEMO = "mi-evento-2026";

type EventoResumen = {
  evento_id: string;
  total_participantes: number;
  ultima_actividad: string;
};

/**
 * No existe una tabla "eventos": el slug de la URL es el identificador.
 * Esta vista agrupa a los participantes por evento_id para poder listar
 * acá los que ya tienen actividad, en vez de obligar a escribir el slug
 * de memoria cada vez (con el riesgo de un typo que "cree" otro evento).
 */
async function obtenerEventosRecientes(): Promise<EventoResumen[]> {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("eventos_resumen")
      .select("evento_id, total_participantes, ultima_actividad")
      .order("ultima_actividad", { ascending: false })
      .limit(12);
    if (error) throw error;
    return (data ?? []) as unknown as EventoResumen[];
  } catch {
    // Si todavía no corriste el SQL de la vista o faltan las env vars,
    // mostramos la home igual, solo sin la lista.
    return [];
  }
}

async function abrirEvento(formData: FormData) {
  "use server";
  const eventoId = normalizarEventoId(String(formData.get("evento") ?? ""));
  redirect(`/evento/${eventoId || EVENTO_DEMO}/admin`);
}

export default async function Home() {
  const eventos = await obtenerEventosRecientes();

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-16">
      <h1 className="text-4xl font-bold text-foreground">Registro y sorteos por QR</h1>
      <p className="mt-3 text-lg text-tenue">
        Un solo QR en la entrada, un formulario simple y sorteos cada hora.
      </p>

      {eventos.length > 0 && (
        <section className="tarjeta mt-8">
          <h2 className="text-lg font-semibold text-foreground">Tus eventos</h2>
          <ul className="mt-3 divide-y divide-linea">
            {eventos.map((evento) => (
              <li
                key={evento.evento_id}
                className="flex flex-wrap items-center justify-between gap-3 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-foreground">
                    {obtenerNombreEvento(evento.evento_id)}
                  </p>
                  <p className="text-sm text-tenue">
                    {evento.total_participantes} participantes · última actividad{" "}
                    {formatearFechaHora(evento.ultima_actividad)}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Link href={`/evento/${evento.evento_id}/admin`} className="boton-secundario">
                    Panel
                  </Link>
                  <Link href={`/evento/${evento.evento_id}`} className="boton-secundario">
                    Registro
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      <form action={abrirEvento} className="tarjeta mt-8 space-y-4">
        <div>
          <label className="etiqueta" htmlFor="evento">
            {eventos.length > 0 ? "Crear o abrir otro evento" : "Nombre del evento"}
          </label>
          <input
            id="evento"
            name="evento"
            defaultValue={eventos.length > 0 ? "" : EVENTO_DEMO}
            placeholder={EVENTO_DEMO}
            className="campo"
          />
          <p className="mt-1.5 text-sm text-tenue">
            Se convierte en la URL del evento. No hace falta crearlo antes: se usa tal cual.
          </p>
        </div>
        <button type="submit" className="boton w-full">
          Abrir panel del evento
        </button>
      </form>

      <section className="mt-10">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-acento">
          Cómo funciona
        </h2>
        <ol className="mt-3 space-y-2 text-neutral-300">
          <li>
            <strong>1.</strong> Entrás al panel y descargás el QR del evento.
          </li>
          <li>
            <strong>2.</strong> La gente lo escanea con su celular y completa el formulario.
          </li>
          <li>
            <strong>3.</strong> Cada hora apretás <em>Sorteo por hora</em>; al cierre, el{" "}
            <em>Sorteo final</em> con 30 o 40 premios.
          </li>
          <li>
            <strong>4.</strong> Los ganadores aparecen en la vista de pantalla para el proyector.
          </li>
        </ol>
      </section>
    </main>
  );
}
