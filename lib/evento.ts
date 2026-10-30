export type Actividad = { hora: string; titulo: string; descripcion: string };
export type Patrocinador = { nombre: string; logo: string; url?: string };
export type Croquis = { src: string; alt: string; ancho: number; alto: number };
export type Flyer = { src: string; alt: string; ancho: number; alto: number };
/** Coordenadas porcentuales sobre el croquis original, sin recortes. */
export type ZonaMapa = { x: number; y: number; ancho: number; alto: number };
export type Stand = {
  id: string;
  nombre: string;
  categoria: string;
  descripcion?: string;
  ubicacion?: string;
  instagram?: string;
  color?: "amarillo" | "verde" | "rojo" | "blanco" | "morado";
  pendiente?: boolean;
  puntoMapa?: ZonaMapa;
  flyer?: Flyer;
};

type Evento = {
  nombre: string;
  edicion: number;
  inicio: string;
  fecha: string;
  hora: string;
  lugar: string;
  ciudad: string;
  mapa: string;
  estacionamientos: { nombre: string; url: string }[];
  lema: string;
  invitacion: string;
  experiencias: { icono: string; titulo: string }[];
  organizador: { nombre: string; instagram: string; url: string };
  croquis: Croquis | null;
  stands: Stand[];
  programa: Actividad[];
  patrocinadores: Patrocinador[];
};

export const evento: Evento = {
  nombre: "Natsumatsuri",
  edicion: 2026,
  inicio: "2026-11-14T18:00:00-03:00",
  fecha: "Sábado 14 de noviembre",
  hora: "18:00",
  lugar: "Cancha de la Asociación Japonesa de Pirapó",
  ciudad: "Pirapó, Itapúa · Paraguay",
  mapa: "https://www.google.com/maps/search/?api=1&query=Cancha%20Asociaci%C3%B3n%20Japonesa%20de%20Pirap%C3%B3%20Paraguay",
  estacionamientos: [
    { nombre: "Cancha de Fútbol Asociación Japonesa", url: "https://maps.app.goo.gl/NtNdv38MHT8m7nyn8" },
    { nombre: "Salón Barrio Obrero", url: "https://maps.app.goo.gl/DWVKxjiUbjmTVsph6" },
    { nombre: "Cuartel de Bomberos K109", url: "https://maps.app.goo.gl/kXKcFmscgSKQq5ii7" },
  ],
  lema: "Japón que nos reúne, la alegría que nos une!!",
  invitacion: "Preparate para vivir una noche especial en el Natsumatsuri 2026",
  experiencias: [
    { icono: "🍡", titulo: "Comidas típicas" },
    { icono: "🎯", titulo: "Juegos para disfrutar en familia" },
    { icono: "💃", titulo: "Presentaciones artísticas" },
    { icono: "🌸", titulo: "Y mucho más!" },
  ],
  organizador: {
    nombre: "Nikkai Seinen Pirapó",
    instagram: "nikkaiseinen_pirapo",
    url: "https://www.instagram.com/nikkaiseinen_pirapo/",
  },
  croquis: {
    src: "/croquis-natsumatsuri-2026.png",
    alt: "Croquis de Natsumatsuri 2026: accesos desde Av. Paraguay - Japón, escenario, zona de juegos, stands, cantina de bebidas, degustación de sake y sanitarios.",
    ancho: 1080,
    alto: 1350,
  },
  stands: [
    {
      id: "pirapo-km-23",
      nombre: "Pirapó Km 23",
      categoria: "Stand identificado",
      color: "amarillo",
      flyer: {
        src: "/flyers/pirapo-km-23.jpeg",
        alt: "Menú de Pirapó Km 23: ramen, yakisoba con fideo casero, gyoza, milanesa de carne con verduras, sushi, matcha latte, café helado y tapioca. Flyer sin precios.",
        ancho: 720,
        alto: 1280,
      },
      puntoMapa: { x: 74.7, y: 57, ancho: 10.5, alto: 8 },
      ubicacion: "Sector derecho del croquis, debajo del Acceso 1 y encima de Acacaraya.",
    },
    {
      id: "pirapo-centro",
      nombre: "Pirapó Centro",
      categoria: "Stand identificado",
      color: "verde",
      flyer: {
        src: "/flyers/pirapo-centro.jpeg",
        alt: "Menú de Pirapó Centro: kara-age, okonomiyaki, takoyaki, mitarashi dango, harumaki, onigiri set y Cup Noodles. Flyer sin precios.",
        ancho: 1122,
        alto: 1402,
      },
      puntoMapa: { x: 74.7, y: 30.6, ancho: 10.5, alto: 8 },
      ubicacion: "Sector superior derecho del croquis, debajo de los stands de alquiler y encima de Ka'arendy.",
    },
    {
      id: "pirapo-km-13",
      nombre: "Pirapó Km 13",
      categoria: "Stand identificado",
      color: "rojo",
      flyer: {
        src: "/flyers/pirapo-km-13.jpeg",
        alt: "Menú de Pirapó Km 13, Tomimura: takoyaki, norimaki, pollo frito, chinchulín a la parrilla, combo de inari y norimaki, yakisoba y dulces varios. Flyer sin precios.",
        ancho: 968,
        alto: 1248,
      },
      puntoMapa: { x: 61.3, y: 66.5, ancho: 10.5, alto: 8 },
      ubicacion: "Sector inferior del croquis, entre la degustación de sake y Acacaraya.",
    },
    {
      id: "acacaraya",
      nombre: "Acacaraya",
      categoria: "Stand identificado",
      color: "blanco",
      flyer: {
        src: "/flyers/acacaraya.webp",
        alt: "Menú de Acacaraya: yakitori, yakisoba, harumaki, onigiri, cerdo agridulce, omochi y dorayaki. Flyer sin precios.",
        ancho: 1800,
        alto: 2700,
      },
      puntoMapa: { x: 74.9, y: 66.4, ancho: 10.5, alto: 8 },
      ubicacion: "Sector inferior derecho del croquis, debajo de Pirapó Km 23.",
    },
    {
      id: "kaarendy",
      nombre: "Ka'arendy",
      categoria: "Stand identificado",
      color: "morado",
      flyer: {
        src: "/flyers/kaarendy.jpeg",
        alt: "Menú de Ka'arendy: milanesa de bambú, salteado de corazón y molleja con verdeo, tragos tropicales de piña y frutilla, helado, café helado con helado y mini bento. Flyer sin precios.",
        ancho: 1434,
        alto: 1423,
      },
      puntoMapa: { x: 74.7, y: 39.8, ancho: 10.5, alto: 8 },
      ubicacion: "Sector derecho del croquis, entre Pirapó Centro y el Acceso 1.",
    },
  ],
  programa: [
    {
      hora: "18:00",
      titulo: "Nos encontramos en Natsumatsuri",
      descripcion: "El inicio de una noche para compartir en Pirapó.",
    },
  ],
  patrocinadores: [],
};

export function obtenerStandsDelMapa(stands: readonly Stand[] = evento.stands) {
  return stands.filter((stand): stand is Stand & { puntoMapa: ZonaMapa } =>
    !stand.pendiente && Boolean(stand.puntoMapa),
  );
}
