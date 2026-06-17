-- ============================================================
-- HABILITAR RLS
-- ============================================================
alter table public.profiles enable row level security;
alter table public.secciones_carta enable row level security;
alter table public.platos enable row level security;
alter table public.franjas_horarias enable row level security;
alter table public.configuracion_restaurante enable row level security;
alter table public.reservas enable row level security;

-- ============================================================
-- HELPER: función para verificar si el usuario actual es admin
-- (security definer para evitar recursión de RLS)
-- ============================================================
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- ============================================================
-- PROFILES
-- ============================================================
create policy "profiles_select_own_or_admin"
  on public.profiles for select
  using (auth.uid() = id or public.is_admin());

-- El cliente puede actualizar su propio perfil pero no puede cambiar su rol
create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id and role = 'cliente');

-- El admin puede actualizar cualquier perfil (incluyendo cambiar roles)
create policy "profiles_admin_update_any"
  on public.profiles for update
  using (public.is_admin());

-- ============================================================
-- SECCIONES_CARTA: lectura pública, escritura solo admin
-- ============================================================
create policy "secciones_select_public"
  on public.secciones_carta for select
  using (true);

create policy "secciones_admin_insert"
  on public.secciones_carta for insert
  with check (public.is_admin());

create policy "secciones_admin_update"
  on public.secciones_carta for update
  using (public.is_admin())
  with check (public.is_admin());

create policy "secciones_admin_delete"
  on public.secciones_carta for delete
  using (public.is_admin());

-- ============================================================
-- PLATOS: lectura pública, escritura solo admin
-- ============================================================
create policy "platos_select_public"
  on public.platos for select
  using (true);

create policy "platos_admin_insert"
  on public.platos for insert
  with check (public.is_admin());

create policy "platos_admin_update"
  on public.platos for update
  using (public.is_admin())
  with check (public.is_admin());

create policy "platos_admin_delete"
  on public.platos for delete
  using (public.is_admin());

-- ============================================================
-- FRANJAS_HORARIAS: lectura pública, escritura solo admin
-- ============================================================
create policy "franjas_select_public"
  on public.franjas_horarias for select
  using (true);

create policy "franjas_admin_insert"
  on public.franjas_horarias for insert
  with check (public.is_admin());

create policy "franjas_admin_update"
  on public.franjas_horarias for update
  using (public.is_admin())
  with check (public.is_admin());

create policy "franjas_admin_delete"
  on public.franjas_horarias for delete
  using (public.is_admin());

-- ============================================================
-- CONFIGURACION_RESTAURANTE: lectura pública, escritura solo admin
-- ============================================================
create policy "config_select_public"
  on public.configuracion_restaurante for select
  using (true);

create policy "config_admin_update"
  on public.configuracion_restaurante for update
  using (public.is_admin())
  with check (public.is_admin());

-- ============================================================
-- RESERVAS
-- ============================================================
create policy "reservas_select_own_or_admin"
  on public.reservas for select
  using (auth.uid() = cliente_id or public.is_admin());

create policy "reservas_insert_own"
  on public.reservas for insert
  with check (auth.uid() = cliente_id);

-- Cancelar (UPDATE estado) propio o admin modifica cualquier campo
create policy "reservas_update_own_or_admin"
  on public.reservas for update
  using (auth.uid() = cliente_id or public.is_admin())
  with check (auth.uid() = cliente_id or public.is_admin());

-- Solo admin puede borrar físicamente
create policy "reservas_delete_admin_only"
  on public.reservas for delete
  using (public.is_admin());
