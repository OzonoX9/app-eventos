import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import type { ParticipantePublico, SorteoConGanadores } from "@/lib/types";
import { enmascararCedula, normalizarEventoId } from "@/lib/utils";

type FilaSorteo = {
  id: string;
  evento_id: string;
  titulo: string;
  tipo: "horario" | "final";
  cantidad_premios: number;
  created_at: string;
  ganadores: Array<{
    posicion: number;
    participante: { id: string; nombre: string; apellido: string; cedula: string } | null;
  }> | null;
};

/**
 * GET /api/sorteos?evento=slug&limit=20
 * Público: solo devuelve nombre, apellido y cédula enmascarada.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const eventoId = normalizarEventoId(searchParams.get("evento") ?? "");
  if (!eventoId) {
    return NextResponse.json({ error: "Falta el parámetro ?evento=" }, { status: 400 });
  }

  const limit = Math.min(Number(searchParams.get("limit") ?? 20) || 20, 100);

  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("sorteos")
    .select(
      "id, evento_id, titulo, tipo, cantidad_premios, created_at, ganadores(posicion, participante:participantes(id, nombre, apellido, cedula))",
    )
    .eq("evento_id", eventoId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error al leer sorteos:", error);
    return NextResponse.json({ error: "No pudimos leer los sorteos" }, { status: 500 });
  }

  const sorteos: SorteoConGanadores<ParticipantePublico>[] = (
    (data ?? []) as unknown as FilaSorteo[]
  ).map((sorteo) => ({
    id: sorteo.id,
    evento_id: sorteo.evento_id,
    titulo: sorteo.titulo,
    tipo: sorteo.tipo,
    cantidad_premios: sorteo.cantidad_premios,
    created_at: sorteo.created_at,
    ganadores: (sorteo.ganadores ?? [])
      .slice()
      .sort((a, b) => a.posicion - b.posicion)
      .map((g) => ({
        posicion: g.posicion,
        participante: g.participante
          ? {
              id: g.participante.id,
              nombre: g.participante.nombre,
              apellido: g.participante.apellido,
              cedula: enmascararCedula(g.participante.cedula),
            }
          : null,
      })),
  }));

  return NextResponse.json({ sorteos });
}
