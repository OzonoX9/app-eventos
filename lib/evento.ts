export type Actividad = { hora: string; titulo: string; descripcion: string };
export type Patrocinador = { nombre: string; logo: string; url?: string };

type Evento = {
  nombre: string;
  edicion: number;
  inicio: string;
  fecha: string;
  hora: string;
  lugar: string;
  ciudad: string;
  mapa: string;
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
  programa: [
    {
      hora: "18:00",
      titulo: "Nos encontramos en Natsumatsuri",
      descripcion: "El inicio de una noche para compartir en Pirapó.",
    },
  ],
  patrocinadores: [],
};
