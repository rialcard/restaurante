-- ============================================================
-- EXTENSIONES
-- ============================================================
create extension if not exists "pgcrypto";

-- ============================================================
-- TIPOS / ENUMS
-- ============================================================
create type public.app_role as enum ('cliente', 'admin');
create type public.reserva_estado as enum ('pendiente', 'confirmada', 'cancelada');
create type public.plato_estado as enum ('activo', 'agotado');

-- ============================================================
-- TABLA: profiles  (1:1 con auth.users)
-- ============================================================
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nombre_completo text not null default '',
  email text not null default '',
  role public.app_role not null default 'cliente',
  telefono text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is 'Perfil de usuario vinculado a auth.users. El rol admin se asigna manualmente en BD.';

-- Trigger: crear perfil automáticamente al registrarse
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, nombre_completo, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'nombre_completo', ''),
    coalesce(new.email, ''),
    'cliente'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Trigger genérico updated_at
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- ============================================================
-- TABLA: secciones_carta
-- ============================================================
create table public.secciones_carta (
  id uuid primary key default gen_random_uuid(),
  nombre text not null unique,
  icono text default 'restaurant_menu',
  orden integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger secciones_set_updated_at
  before update on public.secciones_carta
  for each row execute function public.set_updated_at();

-- ============================================================
-- TABLA: platos
-- ============================================================
create table public.platos (
  id uuid primary key default gen_random_uuid(),
  seccion_id uuid not null references public.secciones_carta(id) on delete restrict,
  nombre text not null,
  descripcion text,
  precio numeric(10,2) not null check (precio >= 0),
  imagen_url text,
  estado public.plato_estado not null default 'activo',
  orden integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index platos_seccion_id_idx on public.platos(seccion_id);

create trigger platos_set_updated_at
  before update on public.platos
  for each row execute function public.set_updated_at();

-- ============================================================
-- TABLA: franjas_horarias
-- ============================================================
create table public.franjas_horarias (
  id uuid primary key default gen_random_uuid(),
  hora time not null unique,
  activa boolean not null default true,
  orden integer not null default 0
);

-- ============================================================
-- TABLA: configuracion_restaurante (fila única)
-- ============================================================
create table public.configuracion_restaurante (
  id integer primary key default 1,
  capacidad_comensales_por_franja integer not null default 40 check (capacidad_comensales_por_franja > 0),
  constraint configuracion_singleton check (id = 1)
);

insert into public.configuracion_restaurante (id, capacidad_comensales_por_franja) values (1, 40);

-- ============================================================
-- TABLA: reservas
-- ============================================================
create table public.reservas (
  id uuid primary key default gen_random_uuid(),
  cliente_id uuid not null references public.profiles(id) on delete cascade,
  fecha date not null,
  franja_horaria_id uuid not null references public.franjas_horarias(id) on delete restrict,
  num_comensales integer not null check (num_comensales >= 1 and num_comensales <= 20),
  estado public.reserva_estado not null default 'pendiente',
  mesa_asignada text,
  notas text,
  llegada_confirmada boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index reservas_cliente_id_idx on public.reservas(cliente_id);
create index reservas_fecha_franja_idx on public.reservas(fecha, franja_horaria_id);

create trigger reservas_set_updated_at
  before update on public.reservas
  for each row execute function public.set_updated_at();

-- ============================================================
-- FUNCIÓN + TRIGGER: control de disponibilidad / solapamiento
-- ============================================================
create or replace function public.check_disponibilidad_reserva()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  v_lock_key bigint;
  v_capacidad integer;
  v_ocupacion_actual integer;
begin
  if new.estado = 'cancelada' then
    return new;
  end if;

  v_lock_key := ('x' || substr(md5(new.fecha::text || new.franja_horaria_id::text), 1, 15))::bit(60)::bigint;
  perform pg_advisory_xact_lock(v_lock_key);

  select capacidad_comensales_por_franja into v_capacidad
  from public.configuracion_restaurante where id = 1;

  select coalesce(sum(num_comensales), 0) into v_ocupacion_actual
  from public.reservas
  where fecha = new.fecha
    and franja_horaria_id = new.franja_horaria_id
    and estado <> 'cancelada'
    and id <> coalesce(new.id, '00000000-0000-0000-0000-000000000000'::uuid);

  if v_ocupacion_actual + new.num_comensales > v_capacidad then
    raise exception 'No hay disponibilidad suficiente para esa fecha y franja horaria. Capacidad: %, Ocupado: %, Solicitado: %',
      v_capacidad, v_ocupacion_actual, new.num_comensales
      using errcode = 'P0001';
  end if;

  return new;
end;
$$;

create trigger reservas_check_disponibilidad
  before insert or update of fecha, franja_horaria_id, num_comensales, estado
  on public.reservas
  for each row execute function public.check_disponibilidad_reserva();
