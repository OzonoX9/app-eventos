export type Actividad = { hora: string; titulo: string; descripcion: string };
export type Patrocinador = { nombre: string; logo: string; url?: string };
export type Croquis = { src: string; alt: string; ancho: number; alto: number };
export type Stand = {
  id: string;
  nombre: string;
  categoria: string;
  descripcion?: string;
  ubicacion?: string;
  instagram?: string;
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
  croquis: null,
  stands: [],
  programa: [
    {
      hora: "18:00",
      titulo: "Nos encontramos en Natsumatsuri",
      descripcion: "El inicio de una noche para compartir en Pirapó.",
    },
  ],
  patrocinadores: [],
};
