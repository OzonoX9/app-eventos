"use client";

import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import type { ParticipantePublico, SorteoConGanadores } from "@/lib/types";
import { formatearHora } from "@/lib/utils";

type Respuesta = { sorteos: SorteoConGanadores<ParticipantePublico>[] };

const REFRESCO_MS = 4000;

/** Vista pensada para proyectar en una TV: se refresca sola. */
export default function VistaPantalla({ eventoId }: { eventoId: string }) {
  const { data, isLoading } = useSWR<Respuesta>(
    `/api/sorteos?evento=${eventoId}&limit=1`,
    fetcher,
    { refreshInterval: REFRESCO_MS },
  );

  const sorteo = data?.sorteos?.[0];

  if (isLoading) {
    return <p className="text-2xl text-slate-400">Cargando…</p>;
  }

  if (!sorteo) {
    return (
      <div className="text-center">
        <p className="text-4xl font-bold text-white">Escaneá el QR para participar</p>
        <p className="mt-4 text-2xl text-slate-400">El primer sorteo está por comenzar</p>
      </div>
    );
  }

  const muchos = sorteo.ganadores.length > 8;

  return (
    <div className="w-full text-center">
      <p className="text-xl uppercase tracking-[0.2em] text-indigo-400">
        {formatearHora(sorteo.created_at)}
      </p>
      <h1 className="mt-2 text-5xl font-black text-white sm:text-6xl">{sorteo.titulo}</h1>

      <ul
        className={`mx-auto mt-10 grid max-w-6xl gap-4 ${
          muchos ? "grid-cols-2 lg:grid-cols-4" : "grid-cols-1 sm:grid-cols-2"
        }`}
      >
        {sorteo.ganadores.map((g) => (
          <li
            key={g.posicion}
            className="rounded-2xl bg-white/10 px-6 py-5 ring-1 ring-white/15 backdrop-blur"
          >
            <p className={`font-bold text-white ${muchos ? "text-2xl" : "text-4xl"}`}>
              {g.participante ? `${g.participante.nombre} ${g.participante.apellido}` : "—"}
            </p>
            <p className="mt-1 font-mono text-sm text-indigo-200">{g.participante?.cedula ?? ""}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
