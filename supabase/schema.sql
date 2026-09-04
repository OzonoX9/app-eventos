-- =====================================================================
-- App de Eventos - esquema de base de datos
-- Ejecutar en Supabase: Dashboard -> SQL Editor -> New query -> Run
-- =====================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------
-- Participantes: una fila por persona que escanea el QR y llena el form
-- ---------------------------------------------------------------------
create table if not exists public.participantes (
  id          uuid primary key default gen_random_uuid(),
  evento_id   text        not null,
  nombre      text        not null,
  apellido    text        not null,
  cedula      text        not null,
  email       text        not null,
  direccion   text        not null,
  created_at  timestamptz not null default now()
);

-- Evita que la misma cédula se registre dos veces en el mismo evento
create unique index if not exists participantes_evento_cedula_uniq
  on public.participantes (evento_id, lower(cedula));

create index if not exists participantes_evento_created_idx
  on public.participantes (evento_id, created_at desc);

-- ---------------------------------------------------------------------
-- Sorteos: cada vez que se aprieta "Sortear" se crea una fila
-- tipo = 'horario' (sorteo por hora) | 'final' (sorteo final con N premios)
-- ---------------------------------------------------------------------
create table if not exists public.sorteos (
  id                uuid primary key default gen_random_uuid(),
  evento_id         text        not null,
  titulo            text        not null,
  tipo              text        not null default 'horario'
                    check (tipo in ('horario', 'final')),
  cantidad_premios  int         not null check (cantidad_premios > 0),
  created_at        timestamptz not null default now()
);

create index if not exists sorteos_evento_created_idx
  on public.sorteos (evento_id, created_at desc);

-- ---------------------------------------------------------------------
-- Ganadores: relación sorteo <-> participante, con la posición del premio
-- ---------------------------------------------------------------------
create table if not exists public.ganadores (
  id              uuid primary key default gen_random_uuid(),
  sorteo_id       uuid        not null references public.sorteos(id)      on delete cascade,
  participante_id uuid        not null references public.participantes(id) on delete cascade,
  posicion        int         not null,
  created_at      timestamptz not null default now(),
  unique (sorteo_id, participante_id)
);

create index if not exists ganadores_sorteo_idx on public.ganadores (sorteo_id);

-- ---------------------------------------------------------------------
-- Seguridad: RLS activado y SIN políticas.
-- Nadie puede leer/escribir con la anon key: todo el acceso pasa por el
-- backend de Next.js usando la service_role key (que ignora RLS).
-- ---------------------------------------------------------------------
alter table public.participantes enable row level security;
alter table public.sorteos       enable row level security;
alter table public.ganadores     enable row level security;
