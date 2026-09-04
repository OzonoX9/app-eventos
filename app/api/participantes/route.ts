import { NextResponse } from "next/server";
import { esAdmin } from "@/lib/auth";
import { getSupabase } from "@/lib/supabase";
import type { Participante } from "@/lib/types";
import { normalizarEventoId } from "@/lib/utils";

/**
 * GET /api/participantes?evento=slug
 * Solo admin: devuelve la lista completa (incluye correo y dirección).
 */
export async function GET(request: Request) {
  if (!(await esAdmin())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const eventoId = normalizarEventoId(searchParams.get("evento") ?? "");
  if (!eventoId) {
    return NextResponse.json({ error: "Falta el parámetro ?evento=" }, { status: 400 });
  }

  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("participantes")
    .select("*")
    .eq("evento_id", eventoId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error al leer participantes:", error);
    return NextResponse.json({ error: "No pudimos leer los participantes" }, { status: 500 });
  }

  const participantes = (data ?? []) as Participante[];
  const haceUnaHora = Date.now() - 60 * 60 * 1000;

  return NextResponse.json({
    participantes,
    stats: {
      total: participantes.length,
      ultimaHora: participantes.filter((p) => new Date(p.created_at).getTime() >= haceUnaHora).length,
    },
  });
}
