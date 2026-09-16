-- ============================================================
-- EXAMOTECA — Políticas de seguridad a nivel de fila (RLS)
-- ============================================================
-- Ejecutar después de 01_schema.sql.
-- Principio: lectura pública de lo publicado; escritura solo del
-- dueño del dato (favoritos/historial) o de administradores
-- (documentos, preguntas, catálogos).

-- ------------------------------------------------------------
-- Función auxiliar: ¿el usuario autenticado es admin?
-- ------------------------------------------------------------
create or replace function es_admin()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from perfiles
    where id = auth.uid() and rol = 'admin'
  );
$$;

-- ------------------------------------------------------------
-- PERFILES
-- ------------------------------------------------------------
alter table perfiles enable row level security;

create policy "Un usuario ve y edita su propio perfil"
  on perfiles for select using (auth.uid() = id);

create policy "Un usuario actualiza su propio perfil"
  on perfiles for update using (auth.uid() = id);

create policy "El admin ve todos los perfiles"
  on perfiles for select using (es_admin());

-- El rol se cambia solo manualmente por un administrador desde el
-- SQL Editor o una función de servidor; no se expone a update público.

-- ------------------------------------------------------------
-- CATÁLOGOS: universidades, materias, carreras
-- ------------------------------------------------------------
alter table universidades enable row level security;
alter table materias enable row level security;
alter table carreras enable row level security;

create policy "Lectura pública de universidades" on universidades for select using (true);
create policy "Lectura pública de materias" on materias for select using (true);
create policy "Lectura pública de carreras" on carreras for select using (true);

create policy "Solo admin modifica universidades" on universidades
  for insert with check (es_admin());
create policy "Solo admin actualiza universidades" on universidades
  for update using (es_admin());
create policy "Solo admin elimina universidades" on universidades
  for delete using (es_admin());

create policy "Solo admin modifica materias" on materias
  for insert with check (es_admin());
create policy "Solo admin actualiza materias" on materias
  for update using (es_admin());
create policy "Solo admin elimina materias" on materias
  for delete using (es_admin());

create policy "Solo admin modifica carreras" on carreras
  for insert with check (es_admin());
create policy "Solo admin actualiza carreras" on carreras
  for update using (es_admin());
create policy "Solo admin elimina carreras" on carreras
  for delete using (es_admin());

-- ------------------------------------------------------------
-- DOCUMENTOS
-- ------------------------------------------------------------
alter table documentos enable row level security;

create policy "Lectura pública de documentos publicados"
  on documentos for select using (publicado = true);

create policy "El admin ve también los no publicados"
  on documentos for select using (es_admin());

create policy "Solo admin sube documentos"
  on documentos for insert with check (es_admin());

create policy "Solo admin edita documentos"
  on documentos for update using (es_admin());

create policy "Solo admin elimina documentos"
  on documentos for delete using (es_admin());

-- ------------------------------------------------------------
-- PREGUNTAS
-- ------------------------------------------------------------
alter table preguntas enable row level security;

create policy "Lectura pública de preguntas revisadas"
  on preguntas for select using (revisada = true);

create policy "El admin ve todas las preguntas, revisadas o no"
  on preguntas for select using (es_admin());

create policy "Solo admin crea preguntas"
  on preguntas for insert with check (es_admin());

create policy "Solo admin edita o aprueba preguntas"
  on preguntas for update using (es_admin());

create policy "Solo admin elimina preguntas"
  on preguntas for delete using (es_admin());

-- ------------------------------------------------------------
-- FAVORITOS (documentos y preguntas)
-- ------------------------------------------------------------
alter table favoritos_documentos enable row level security;
alter table favoritos_preguntas enable row level security;

create policy "Un usuario administra solo sus favoritos de documentos"
  on favoritos_documentos for all
  using (auth.uid() = usuario_id)
  with check (auth.uid() = usuario_id);

create policy "Un usuario administra solo sus favoritos de preguntas"
  on favoritos_preguntas for all
  using (auth.uid() = usuario_id)
  with check (auth.uid() = usuario_id);

-- ------------------------------------------------------------
-- SIMULADORES E HISTORIAL
-- ------------------------------------------------------------
alter table simuladores_realizados enable row level security;
alter table simulador_respuestas enable row level security;

create policy "Un usuario ve y crea su propio historial"
  on simuladores_realizados for all
  using (auth.uid() = usuario_id)
  with check (auth.uid() = usuario_id);

create policy "Un usuario ve y crea el detalle de sus propios simuladores"
  on simulador_respuestas for all
  using (
    exists (
      select 1 from simuladores_realizados s
      where s.id = simulador_id and s.usuario_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from simuladores_realizados s
      where s.id = simulador_id and s.usuario_id = auth.uid()
    )
  );
