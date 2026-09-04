export type TipoSorteo = "horario" | "final";

export type Participante = {
  id: string;
  evento_id: string;
  nombre: string;
  apellido: string;
  cedula: string;
  email: string;
  direccion: string;
  created_at: string;
};

/** Datos de un participante seguros para mostrar en público (pantalla). */
export type ParticipantePublico = {
  id: string;
  nombre: string;
  apellido: string;
  cedula: string; // parcialmente enmascarada
};

export type Sorteo = {
  id: string;
  evento_id: string;
  titulo: string;
  tipo: TipoSorteo;
  cantidad_premios: number;
  created_at: string;
};

export type SorteoConGanadores<T = Participante> = Sorteo & {
  ganadores: Array<{
    posicion: number;
    participante: T | null;
  }>;
};

export type FormularioRegistro = {
  nombre: string;
  apellido: string;
  cedula: string;
  email: string;
  direccion: string;
};
