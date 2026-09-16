"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import useSWR from "swr";
import LogoEvento from "@/app/components/LogoEvento";
import { obtenerNombreEvento } from "@/lib/eventos-config";
import { fetcher } from "@/lib/fetcher";
import type { Participante, ParticipantePublico, SorteoConGanadores } from "@/lib/types";
import { formatearFecha, formatearFechaHora, formatearHora } from "@/lib/utils";
import TarjetaQR from "./TarjetaQR";

type RespuestaParticipantes = {
  participantes: Participante[];
  stats: { total: number; ultimaHora: number };
};

type RespuestaSorteos = {
  sorteos: SorteoConGanadores<ParticipantePublico>[];
};

const REFRESCO_MS = 5000;
const ATAJOS_CANTIDAD = [1, 3, 5, 30, 40];

export default function PanelAdmin({
  eventoId,
  baseUrl,
}: {
  eventoId: string;
  baseUrl: string;
}) {
  const router = useRouter();

  const {
    data: datosParticipantes,
    error: errorParticipantes,
    isLoading,
    mutate: recargarParticipantes,
  } = useSWR<RespuestaParticipantes>(
    `/api/participantes?evento=${eventoId}`,
    fetcher,
    { refreshInterval: REFRESCO_MS },
  );

  const { data: datosSorteos, mutate: recargarSorteos } = useSWR<RespuestaSorteos>(
    `/api/sorteos?evento=${eventoId}`,
    fetcher,
    { refreshInterval: REFRESCO_MS },
  );

  // Configuración del sorteo
  const [cantidad, setCantidad] = useState(1);
  const [titulo, setTitulo] = useState("");
  const [excluirGanadores, setExcluirGanadores] = useState(true);
  const [soloUltimaHora, setSoloUltimaHora] = useState(false);
  const [sorteando, setSorteando] = useState(false);
  const [errorSorteo, setErrorSorteo] = useState<string | null>(null);

  const participantes = datosParticipantes?.participantes ?? [];
  const stats = datosParticipantes?.stats ?? { total: 0, ultimaHora: 0 };
  const sorteos = datosSorteos?.sorteos ?? [];
  const totalGanadores = sorteos.reduce((acc, s) => acc + s.ganadores.length, 0);

  async function sortear(tipo: "horario" | "final") {
    setSorteando(true);
    setErrorSorteo(null);
    try {
      const res = await fetch("/api/sortear", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventoId,
          tipo,
          titulo,
          cantidad,
          excluirGanadores,
          soloUltimaHora: tipo === "horario" ? soloUltimaHora : false,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setErrorSorteo(json.error ?? "No pudimos hacer el sorteo");
        return;
      }
      setTitulo("");
      await Promise.all([recargarSorteos(), recargarParticipantes()]);
    } catch {
      setErrorSorteo("Error de conexión al sortear");
    } finally {
      setSorteando(false);
    }
  }

  function exportarCSV() {
    const encabezados = ["Nombre", "Apellido", "Cédula", "Teléfono", "Dirección", "Registrado"];
    const filas = participantes.map((p) => [
      p.nombre,
      p.apellido,
      p.cedula,
      p.telefono,
      p.direccion,
      new Date(p.created_at).toLocaleString("es-PY"),
    ]);

    const csv = [encabezados, ...filas]
      .map((fila) => fila.map((celda) => `"${String(celda).replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const url = URL.createObjectURL(new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" }));
    const enlace = document.createElement("a");
    enlace.href = url;
    enlace.download = `participantes-${eventoId}.csv`;
    enlace.click();
    URL.revokeObjectURL(url);
  }

  async function cerrarSesion() {
    await fetch("/api/admin/sesion", { method: "DELETE" });
    //router.refresh(); //Esta funcion cierra la sesion pero no redirige a la pagina de login, por eso se usa router.push
    router.replace("/");
  }

  const mensajeError = errorSorteo ?? errorParticipantes?.message ?? null;

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <LogoEvento eventoId={eventoId} tipo="compacto" tamano="md" />
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-acento">
              {obtenerNombreEvento(eventoId)}
            </p>
            <h1 className="text-2xl font-bold text-foreground">Panel de control</h1>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href={`/evento/${eventoId}/pantalla`} target="_blank" className="boton-secundario">
            Abrir pantalla
          </Link>
          <button
            type="button"
            onClick={exportarCSV}
            disabled={participantes.length === 0}
            className="boton-secundario"
          >
            Exportar CSV
          </button>
          <button type="button" onClick={cerrarSesion} className="boton-secundario">
            Salir
          </button>
        </div>
      </header>

      {mensajeError && (
        <p role="alert" className="alerta mb-4">
          {mensajeError}
        </p>
      )}

      <section className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Metrica etiqueta="Cantidad de Participantes" valor={isLoading ? "…" : stats.total} destacado />
        <Metrica etiqueta="Registrados en la Última hora" valor={isLoading ? "…" : stats.ultimaHora} />
        <Metrica etiqueta="Sorteos" valor={sorteos.length} />
        <Metrica etiqueta="Ganadores" valor={totalGanadores} />
      </section>

      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        <div className="space-y-6">
          <TarjetaQR eventoId={eventoId} baseUrl={baseUrl} />

          <section className="tarjeta">
            <h2 className="text-lg font-semibold text-foreground">Hacer un sorteo</h2>

            <div className="mt-4 space-y-4">
              <div>
                <label className="etiqueta" htmlFor="titulo">
                  Título (opcional)
                </label>
                <input
                  id="titulo"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  placeholder="Ej: Sorteo de las 19:00"
                  className="campo"
                />
              </div>

              <div>
                <label className="etiqueta" htmlFor="cantidad">
                  Cantidad de premios
                </label>
                <input
                  id="cantidad"
                  type="number"
                  min={1}
                  max={200}
                  value={cantidad}
                  onChange={(e) => setCantidad(Math.max(1, Number(e.target.value) || 1))}
                  className="campo"
                />
                <div className="mt-2 flex flex-wrap gap-2">
                  {ATAJOS_CANTIDAD.map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setCantidad(n)}
                      className="rounded-lg border border-linea bg-superficie-alta px-3 py-1 text-sm text-neutral-300 transition hover:border-acento hover:text-acento"
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              <label className="flex items-center gap-2 text-sm text-neutral-300">
                <input
                  type="checkbox"
                  checked={excluirGanadores}
                  onChange={(e) => setExcluirGanadores(e.target.checked)}
                  className="h-4 w-4 rounded border-linea accent-acento-fuerte"
                />
                No repetir personas que ya ganaron
              </label>

              <label className="flex items-center gap-2 text-sm text-neutral-300">
                <input
                  type="checkbox"
                  checked={soloUltimaHora}
                  onChange={(e) => setSoloUltimaHora(e.target.checked)}
                  className="h-4 w-4 rounded border-linea accent-acento-fuerte"
                />
                Solo entre los registrados en la última hora
              </label>

              <div className="grid gap-2 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => sortear("horario")}
                  disabled={sorteando || stats.total === 0}
                  className="boton"
                >
                  {sorteando ? "Sorteando…" : "Sorteo por hora"}
                </button>
                <button
                  type="button"
                  onClick={() => sortear("final")}
                  disabled={sorteando || stats.total === 0}
                  className="boton bg-amber-500 text-neutral-950 hover:bg-amber-400 focus-visible:outline-amber-500"
                >
                  Sorteo final
                </button>
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="tarjeta">
            <h2 className="text-lg font-semibold text-foreground">Historial de sorteos</h2>
            {sorteos.length === 0 ? (
              <p className="mt-3 text-sm text-tenue">Todavía no se hizo ningún sorteo.</p>
            ) : (
              <ul className="mt-4 space-y-4">
                {sorteos.map((sorteo) => (
                  <li key={sorteo.id} className="rounded-xl border border-linea p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="font-semibold text-foreground">
                        {sorteo.titulo}
                        {sorteo.tipo === "final" && (
                          <span className="ml-2 rounded-full bg-amber-500/15 px-2 py-0.5 text-xs font-medium text-amber-300">
                            final
                          </span>
                        )}
                      </h3>
                      <span className="text-sm text-tenue">
                        {formatearFechaHora(sorteo.created_at)}
                      </span>
                    </div>
                    <ol className="mt-3 grid gap-1 sm:grid-cols-2">
                      {sorteo.ganadores.map((g) => (
                        <li key={g.posicion} className="text-sm text-neutral-300">
                          <span className="mr-2 font-mono text-xs text-neutral-500">
                            {String(g.posicion).padStart(2, "0")}
                          </span>
                          {g.participante
                            ? `${g.participante.nombre} ${g.participante.apellido} · ${g.participante.cedula}`
                            : "Participante eliminado"}
                        </li>
                      ))}
                    </ol>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="tarjeta">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Participantes</h2>
              <span className="text-sm text-tenue">se actualiza solo</span>
            </div>

            {participantes.length === 0 ? (
              <p className="mt-3 text-sm text-tenue">
                {isLoading ? "Cargando…" : "Todavía nadie se registró."}
              </p>
            ) : (
              <div className="mt-4 max-h-[420px] overflow-y-auto">
                <table className="w-full text-left text-sm">
                  <thead className="sticky top-0 bg-superficie text-xs uppercase text-tenue">
                    <tr>
                      <th className="pb-2">Nombre</th>
                      <th className="pb-2">Cédula</th>
                      <th className="pb-2">Teléfono</th>
                      <th className="pb-2">Hora</th>
                      <th className="pb-2">Fecha</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-linea">
                    {participantes.map((p) => (
                      <tr key={p.id}>
                        <td className="py-2 pr-3 text-foreground">
                          {p.nombre} {p.apellido}
                        </td>
                        <td className="py-2 pr-3 font-mono text-xs text-neutral-400">{p.cedula}</td>
                        <td className="py-2 pr-3 text-neutral-400">{p.telefono}</td>
                        <td className="py-2 text-tenue">{formatearHora(p.created_at)}</td>
                        <td className="py-2 text-tenue">{formatearFecha(p.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

function Metrica({
  etiqueta,
  valor,
  destacado = false,
}: {
  etiqueta: string;
  valor: number | string;
  destacado?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-linea bg-superficie p-4 shadow-lg shadow-black/40">
      <p className="text-xs uppercase tracking-wide text-tenue">{etiqueta}</p>
      <p className={`mt-1 text-3xl font-bold ${destacado ? "text-acento" : "text-foreground"}`}>
        {valor}
      </p>
    </div>
  );
}
