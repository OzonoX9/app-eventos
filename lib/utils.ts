import type { FormularioRegistro } from "./types";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Normaliza el slug del evento que viene en la URL. */
export function normalizarEventoId(valor: string): string {
  return valor
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

/** Deja solo dígitos: la cédula se guarda normalizada. */
export function normalizarCedula(valor: string): string {
  return valor.replace(/\D/g, "");
}

/** Oculta parte de la cédula para mostrarla en público. */
export function enmascararCedula(cedula: string): string {
  if (cedula.length <= 3) return "***";
  return `${cedula.slice(0, -3)}***`;
}

export type ResultadoValidacion =
  | { ok: true; datos: FormularioRegistro }
  | { ok: false; errores: Partial<Record<keyof FormularioRegistro, string>> };

/**
 * Valida y normaliza el formulario. Se usa igual en el cliente (feedback
 * inmediato) y en el servidor (fuente de verdad).
 */
export function validarRegistro(entrada: Partial<FormularioRegistro>): ResultadoValidacion {
  const errores: Partial<Record<keyof FormularioRegistro, string>> = {};

  const nombre = (entrada.nombre ?? "").trim();
  const apellido = (entrada.apellido ?? "").trim();
  const cedula = normalizarCedula(entrada.cedula ?? "");
  const email = (entrada.email ?? "").trim().toLowerCase();
  const direccion = (entrada.direccion ?? "").trim();

  if (nombre.length < 2) errores.nombre = "Ingresá tu nombre";
  if (apellido.length < 2) errores.apellido = "Ingresá tu apellido";
  if (cedula.length < 5 || cedula.length > 15) errores.cedula = "Cédula inválida (solo números)";
  if (!EMAIL_RE.test(email)) errores.email = "Correo inválido";
  if (direccion.length < 5) errores.direccion = "Ingresá tu dirección";

  if (Object.keys(errores).length > 0) return { ok: false, errores };

  return { ok: true, datos: { nombre, apellido, cedula, email, direccion } };
}

export function formatearHora(iso: string): string {
  return new Date(iso).toLocaleTimeString("es-PY", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatearFechaHora(iso: string): string {
  return new Date(iso).toLocaleString("es-PY", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}
