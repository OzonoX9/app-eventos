import { NextResponse } from "next/server";
import { esAdmin } from "@/lib/auth";
import { elegirGanadores } from "@/lib/sorteo";
import { getSupabase } from "@/lib/supabase";
import type { Participante, TipoSorteo } from "@/lib/types";
import { enmascararCedula, normalizarEventoId } from "@/lib/utils";

const UNA_HORA_MS = 60 * 60 * 1000;

/**
 * POST /api/sortear
 * body: {
 *   eventoId: string,
 *   titulo?: string,
 *   tipo?: "horario" | "final",
 *   cantidad?: number,
 *   excluirGanadores?: boolean,  // no repetir gente que ya ganó
 *   soloUltimaHora?: boolean     // sortear solo entre los que entraron en la última hora
 * }
 */
export async function POST(request: Request) {
  if (!(await esAdmin())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const eventoId = normalizarEventoId(String(body.eventoId ?? ""));
  if (!eventoId) {
    return NextResponse.json({ error: "Evento inválido" }, { status: 400 });
  }

  const tipo: TipoSorteo = body.tipo === "final" ? "final" : "horario";
  const cantidadPedida = Math.floor(Number(body.cantidad ?? 1));
  if (!Number.isFinite(cantidadPedida) || cantidadPedida < 1 || cantidadPedida > 200) {
    return NextResponse.json({ error: "La cantidad debe estar entre 1 y 200" }, { status: 400 });
  }

  const excluirGanadores = body.excluirGanadores !== false; // por defecto true
  const soloUltimaHora = body.soloUltimaHora === true;
  const titulo =
    String(body.titulo ?? "").trim() || (tipo === "final" ? "Sorteo final" : "Sorteo por hora");

  const supabase = getSupabase();

  // 1. Candidatos
  let query = supabase
    .from("participantes")
    .select("id, nombre, apellido, cedula, created_at")
    .eq("evento_id", eventoId);

  if (soloUltimaHora) {
    query = query.gte("created_at", new Date(Date.now() - UNA_HORA_MS).toISOString());
  }

  const { data: participantes, error: errorParticipantes } = await query;
  if (errorParticipantes) {
    console.error("Error al leer participantes:", errorParticipantes);
    return NextResponse.json({ error: "No pudimos leer los participantes" }, { status: 500 });
  }

  let candidatos = (participantes ?? []) as Pick<
    Participante,
    "id" | "nombre" | "apellido" | "cedula" | "created_at"
  >[];

  // 2. Excluir quienes ya ganaron en este evento
  if (excluirGanadores && candidatos.length > 0) {
    const { data: sorteosPrevios } = await supabase
      .from("sorteos")
      .select("id")
      .eq("evento_id", eventoId);

    const idsSorteos = (sorteosPrevios ?? []).map((s: { id: string }) => s.id);
    if (idsSorteos.length > 0) {
      const { data: previos } = await supabase
        .from("ganadores")
        .select("participante_id")
        .in("sorteo_id", idsSorteos);

      const yaGanaron = new Set((previos ?? []).map((g: { participante_id: string }) => g.participante_id));
      candidatos = candidatos.filter((p) => !yaGanaron.has(p.id));
    }
  }

  if (candidatos.length === 0) {
    return NextResponse.json(
      {
        error: soloUltimaHora
          ? "No hay participantes elegibles en la última hora."
          : "No hay participantes elegibles para sortear.",
      },
      { status: 409 },
    );
  }

  const cantidad = Math.min(cantidadPedida, candidatos.length);
  const ganadores = elegirGanadores(candidatos, cantidad);

  // 3. Persistir el sorteo
  const { data: sorteo, error: errorSorteo } = await supabase
    .from("sorteos")
    .insert({ evento_id: eventoId, titulo, tipo, cantidad_premios: cantidad })
    .select("id, evento_id, titulo, tipo, cantidad_premios, created_at")
    .single();

  if (errorSorteo || !sorteo) {
    console.error("Error al crear sorteo:", errorSorteo);
    return NextResponse.json({ error: "No pudimos crear el sorteo" }, { status: 500 });
  }

  const { error: errorGanadores } = await supabase.from("ganadores").insert(
    ganadores.map((p, i) => ({
      sorteo_id: sorteo.id,
      participante_id: p.id,
      posicion: i + 1,
    })),
  );

  if (errorGanadores) {
    console.error("Error al guardar ganadores:", errorGanadores);
    await supabase.from("sorteos").delete().eq("id", sorteo.id); // rollback manual
    return NextResponse.json({ error: "No pudimos guardar los ganadores" }, { status: 500 });
  }

  return NextResponse.json(
    {
      ok: true,
      sorteo: {
        ...sorteo,
        ganadores: ganadores.map((p, i) => ({
          posicion: i + 1,
          participante: {
            id: p.id,
            nombre: p.nombre,
            apellido: p.apellido,
            cedula: enmascararCedula(p.cedula),
          },
        })),
      },
      candidatosElegibles: candidatos.length,
    },
    { status: 201 },
  );
}
