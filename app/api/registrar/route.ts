import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { normalizarEventoId, validarRegistro } from "@/lib/utils";

export async function POST(request: Request) {
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

  const validacion = validarRegistro({
    nombre: String(body.nombre ?? ""),
    apellido: String(body.apellido ?? ""),
    cedula: String(body.cedula ?? ""),
    email: String(body.email ?? ""),
    direccion: String(body.direccion ?? ""),
  });

  if (!validacion.ok) {
    return NextResponse.json(
      { error: "Revisá los datos del formulario", errores: validacion.errores },
      { status: 422 },
    );
  }

  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("participantes")
    .insert({ evento_id: eventoId, ...validacion.datos })
    .select("id, nombre, created_at")
    .single();

  if (error) {
    // 23505 = unique_violation -> esa cédula ya se registró en este evento
    if (error.code === "23505") {
      return NextResponse.json(
        { error: "Esa cédula ya está registrada en este evento. ¡Ya estás participando!" },
        { status: 409 },
      );
    }
    console.error("Error al registrar participante:", error);
    return NextResponse.json({ error: "No pudimos guardar tu registro. Intentá de nuevo." }, { status: 500 });
  }

  return NextResponse.json({ ok: true, participante: data }, { status: 201 });
}
