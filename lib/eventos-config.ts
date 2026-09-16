/**
 * Configuración visual de cada evento (nombre y logos).
 *
 * No existe una tabla "eventos" en la base: el slug de la URL es el evento.
 * Por eso los logos se declaran acá, en el repo, y las imágenes van en
 * `public/logos/<slug>/`. Cambiar un logo = commit + deploy.
 *
 * Para agregar un evento:
 *   1. Copiá los archivos a `public/logos/<slug>/`, todo en minúsculas
 *      (en producción las rutas distinguen mayúsculas de minúsculas).
 *   2. Agregá una entrada en EVENTOS usando el slug exacto de la URL
 *      (el que produce `normalizarEventoId`: minúsculas y guiones).
 */

export type Logo = {
  /** Ruta dentro de `public`, ej: "/logos/natsumatsuri-2026/logo.png" */
  src: string;
  /** Texto alternativo. Usá "" solo si el logo es puramente decorativo. */
  alt: string;
  /** Tamaño real del archivo en px. Se usa para reservar espacio y evitar
   *  saltos de layout: el tamaño visible lo decide el componente. */
  ancho: number;
  alto: number;
  /** Si se define, el logo se vuelve un enlace (útil para sponsors). */
  href?: string;
};

export type ConfigEvento = {
  /** Nombre para mostrar. Si falta, se deriva del slug. */
  nombre?: string;
  /** Logo grande: formulario de registro y pantalla del proyector. */
  logo?: Logo;
  /** Versión compacta para encabezados (panel). Si falta se usa `logo`. */
  logoCompacto?: Logo;
  /** Logos de sponsors, se muestran en una franja aparte. */
  sponsors?: Logo[];
};

const EVENTOS: Record<string, ConfigEvento> = {
  "natsumatsuri-2026": {
    nombre: "Natsumatsuri 2026",
    logo: {
      src: "/logos/natsumatsuri-2026/natsumatsuri-grande-blanco.png",
      alt: "Natsumatsuri 2026",
      ancho: 2180,
      alto: 1081,
    },
    logoCompacto: {
      src: "/logos/natsumatsuri-2026/natsumatsuri-chico-blanco.png",
      alt: "Natsumatsuri 2026",
      ancho: 1080,
      alto: 1080,
    },
  },
};

export function obtenerConfigEvento(eventoId: string): ConfigEvento {
  return EVENTOS[eventoId] ?? {};
}

/**
 * Logo del evento. "compacto" cae al logo grande si no hay versión chica,
 * así un evento puede configurar uno solo y funcionar en todas las vistas.
 */
export function obtenerLogo(
  eventoId: string,
  tipo: "principal" | "compacto" = "principal",
): Logo | null {
  const config = obtenerConfigEvento(eventoId);
  if (tipo === "compacto") return config.logoCompacto ?? config.logo ?? null;
  return config.logo ?? null;
}

export function obtenerSponsors(eventoId: string): Logo[] {
  return obtenerConfigEvento(eventoId).sponsors ?? [];
}

/** Nombre a mostrar: el configurado o el slug con espacios. */
export function obtenerNombreEvento(eventoId: string): string {
  return obtenerConfigEvento(eventoId).nombre ?? eventoId.replace(/-/g, " ");
}
