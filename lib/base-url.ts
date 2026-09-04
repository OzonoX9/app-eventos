import { headers } from "next/headers";

/**
 * URL base real de la request (localhost, IP de la red local o dominio de
 * producción). Se usa para armar el link que codifica el QR.
 */
export async function obtenerBaseUrl(): Promise<string> {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const protocolo =
    h.get("x-forwarded-proto") ?? (host.startsWith("localhost") || host.startsWith("127.") ? "http" : "https");
  return `${protocolo}://${host}`;
}
