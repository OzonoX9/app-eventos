import { randomInt } from "node:crypto";

/**
 * Fisher-Yates usando `crypto.randomInt` (no `Math.random`) para que el
 * sorteo sea uniformemente aleatorio y no predecible.
 * Devuelve una copia; no muta el array original.
 */
export function mezclar<T>(items: readonly T[]): T[] {
  const copia = [...items];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = randomInt(0, i + 1);
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

/** Elige `cantidad` elementos al azar, sin repetir. */
export function elegirGanadores<T>(candidatos: readonly T[], cantidad: number): T[] {
  return mezclar(candidatos).slice(0, Math.max(0, cantidad));
}
