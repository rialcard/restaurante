-- Franjas horarias (turno comida y cena)
insert into public.franjas_horarias (hora, orden) values
  ('13:00', 1),
  ('13:30', 2),
  ('14:00', 3),
  ('14:30', 4),
  ('20:00', 5),
  ('20:30', 6),
  ('21:00', 7),
  ('21:30', 8),
  ('22:00', 9)
on conflict (hora) do nothing;

-- Secciones de carta iniciales
insert into public.secciones_carta (nombre, icono, orden) values
  ('Entrantes', 'tapas', 1),
  ('Hamburguesas', 'lunch_dining', 2),
  ('Bebidas', 'local_bar', 3),
  ('Postres', 'icecream', 4)
on conflict (nombre) do nothing;

-- NOTA: Para promover un usuario a admin, ejecutar manualmente:
-- update public.profiles set role = 'admin' where email = 'EMAIL_DEL_ADMIN';
