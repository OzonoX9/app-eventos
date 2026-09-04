import Link from "next/link";
import { redirect } from "next/navigation";
import { normalizarEventoId } from "@/lib/utils";

const EVENTO_DEMO = "mi-evento-2026";

async function abrirEvento(formData: FormData) {
  "use server";
  const eventoId = normalizarEventoId(String(formData.get("evento") ?? ""));
  redirect(`/evento/${eventoId || EVENTO_DEMO}/admin`);
}

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-16">
      <h1 className="text-4xl font-bold text-slate-900">Registro y sorteos por QR</h1>
      <p className="mt-3 text-lg text-slate-600">
        Un solo QR en la entrada, un formulario simple y sorteos cada hora.
      </p>

      <form action={abrirEvento} className="tarjeta mt-8 space-y-4">
        <div>
          <label className="etiqueta" htmlFor="evento">
            Nombre del evento
          </label>
          <input
            id="evento"
            name="evento"
            defaultValue={EVENTO_DEMO}
            placeholder={EVENTO_DEMO}
            className="campo"
          />
          <p className="mt-1.5 text-sm text-slate-500">
            Se convierte en la URL del evento. No hace falta crearlo antes: se usa tal cual.
          </p>
        </div>
        <button type="submit" className="boton w-full">
          Abrir panel del evento
        </button>
      </form>

      <section className="mt-10">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Cómo funciona
        </h2>
        <ol className="mt-3 space-y-2 text-slate-700">
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

      <p className="mt-8 text-sm text-slate-500">
        ¿Querés ver el formulario?{" "}
        <Link href={`/evento/${EVENTO_DEMO}`} className="font-medium text-indigo-600 underline">
          Abrir el registro de ejemplo
        </Link>
      </p>
    </main>
  );
}
