/** Fetcher para SWR: lanza un Error con el mensaje que devuelve la API. */
export async function fetcher<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json.error ?? "No pudimos conectarnos al servidor");
  }
  return res.json() as Promise<T>;
}
