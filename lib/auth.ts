import { createHash, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "evento_admin";
export const ADMIN_COOKIE_MAX_AGE = 60 * 60 * 12; // 12 horas

/**
 * Token derivado de ADMIN_PASSWORD. Se guarda en una cookie httpOnly para no
 * tener que mandar la contraseña en cada request.
 */
export function adminToken(): string | null {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return null;
  return createHash("sha256").update(password).digest("hex");
}

export function tokenEsValido(valor: string | undefined): boolean {
  const esperado = adminToken();
  if (!esperado || !valor || valor.length !== esperado.length) return false;
  return timingSafeEqual(Buffer.from(valor), Buffer.from(esperado));
}

/** Lee la cookie de la request actual y valida la sesión de admin. */
export async function esAdmin(): Promise<boolean> {
  const store = await cookies();
  return tokenEsValido(store.get(ADMIN_COOKIE)?.value);
}
