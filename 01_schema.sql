-- ============================================================
-- EXAMOTECA — Esquema de base de datos (PostgreSQL / Supabase)
-- ============================================================
-- Ejecutar en el SQL Editor de Supabase, en orden.
-- Requiere la extensión pgcrypto para generar UUIDs.

create extension if not exists "pgcrypto";

-- ------------------------------------------------------------
-- 1. CATÁLOGOS (para que el admin pueda agregar sin tocar código)
-- ------------------------------------------------------------

create table universidades (
  id          uuid primary key default gen_random_uuid(),
  nombre      text not null unique,
  slug        text not null unique,          -- para URLs: /universidades/unam
  creado_en   timestamptz not null default now()
);

create table materias (
  id          uuid primary key default gen_random_uuid(),
  nombre      text not null unique,
  slug        text not null unique,          -- /materias/biologia
  icono       text,                          -- referencia a un ícono en el frontend
  creado_en   timestamptz not null default now()
);

create table carreras (
  id          uuid primary key default gen_random_uuid(),
  nombre      text not null unique,
  creado_en   timestamptz not null default now()
);

-- ------------------------------------------------------------
-- 2. PERFILES Y ROLES
-- ------------------------------------------------------------
-- Supabase Auth ya crea auth.users; esta tabla extiende con el rol.

create table perfiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  nombre      text,
  rol         text not null default 'usuario' check (rol in ('usuario', 'admin')),
  creado_en   timestamptz not null default now()
);

-- ------------------------------------------------------------
-- 3. DOCUMENTOS PDF  (metadatos pedidos en la especificación)
-- ------------------------------------------------------------

create table documentos (
  id                  uuid primary key default gen_random_uuid(),
  titulo              text not null,
  slug                text not null unique,           -- URL amigable del documento
  universidad_id      uuid references universidades(id),
  carrera_id          uuid references carreras(id),
  materia_id          uuid references materias(id) not null,
  anio                int,
  tipo                text not null check (tipo in (
                        'Examen universitario', 'Banco de preguntas', 'Guía de estudio',
                        'Simulador de examen', 'Cuestionario', 'Examen de admisión', 'Otro'
                      )),
  numero_preguntas    int default 0,
  tiene_respuestas    boolean not null default false,
  dificultad          text not null default 'Intermedia' check (dificultad in ('Fácil', 'Intermedia', 'Difícil')),
  descripcion         text,
  etiquetas           text[] default '{}',
  archivo_ruta        text not null,                  -- ruta dentro del bucket de Storage
  portada_ruta        text,                            -- miniatura de portada, opcional
  es_demo             boolean not null default false,  -- marca "DEMO — Documento de ejemplo"
  publicado           boolean not null default false,  -- el admin revisa antes de publicar
  subido_por          uuid references perfiles(id),
  fecha_agregado      timestamptz not null default now()
);

create index idx_documentos_materia on documentos(materia_id);
create index idx_documentos_universidad on documentos(universidad_id);
create index idx_documentos_publicado on documentos(publicado);

-- Búsqueda de texto completo (título, descripción, etiquetas) para el buscador principal
alter table documentos add column busqueda tsvector
  generated always as (
    setweight(to_tsvector('spanish', coalesce(titulo, '')), 'A') ||
    setweight(to_tsvector('spanish', coalesce(descripcion, '')), 'B') ||
    setweight(to_tsvector('spanish', array_to_string(coalesce(etiquetas, '{}'), ' ')), 'C')
  ) stored;

create index idx_documentos_busqueda on documentos using gin(busqueda);

-- ------------------------------------------------------------
-- 4. PREGUNTAS (extraídas de un documento, revisadas por el admin)
-- ------------------------------------------------------------

create table preguntas (
  id                uuid primary key default gen_random_uuid(),
  documento_id      uuid references documentos(id) on delete cascade,
  materia_id        uuid references materias(id) not null,
  enunciado         text not null,
  opciones          jsonb not null,          -- ["Opción A", "Opción B", "Opción C", "Opción D"]
  respuesta_correcta int not null,           -- índice 0-based dentro de "opciones"
  explicacion       text,
  dificultad        text default 'Intermedia' check (dificultad in ('Fácil', 'Intermedia', 'Difícil')),
  origen            text not null default 'manual' check (origen in ('manual', 'extraccion_automatica')),
  revisada          boolean not null default false,  -- el admin debe aprobar las extraídas automáticamente
  creado_en         timestamptz not null default now()
);

create index idx_preguntas_materia on preguntas(materia_id);
create index idx_preguntas_documento on preguntas(documento_id);

-- ------------------------------------------------------------
-- 5. FAVORITOS (documentos y preguntas guardados por el usuario)
-- ------------------------------------------------------------

create table favoritos_documentos (
  usuario_id    uuid references perfiles(id) on delete cascade,
  documento_id  uuid references documentos(id) on delete cascade,
  creado_en     timestamptz not null default now(),
  primary key (usuario_id, documento_id)
);

create table favoritos_preguntas (
  usuario_id    uuid references perfiles(id) on delete cascade,
  pregunta_id   uuid references preguntas(id) on delete cascade,
  creado_en     timestamptz not null default now(),
  primary key (usuario_id, pregunta_id)
);

-- ------------------------------------------------------------
-- 6. SIMULADORES E HISTORIAL
-- ------------------------------------------------------------

create table simuladores_realizados (
  id                uuid primary key default gen_random_uuid(),
  usuario_id        uuid references perfiles(id) on delete cascade,
  materia_id        uuid references materias(id),
  numero_preguntas  int not null,
  correctas         int not null,
  porcentaje        numeric(5,2) not null,
  tiempo_limite_seg int,             -- null = sin límite de tiempo
  tiempo_usado_seg  int not null,
  dificultad        text,
  realizado_en      timestamptz not null default now()
);

-- Detalle de cada respuesta dentro de un simulador (para la revisión posterior)
create table simulador_respuestas (
  id                    uuid primary key default gen_random_uuid(),
  simulador_id          uuid references simuladores_realizados(id) on delete cascade,
  pregunta_id           uuid references preguntas(id),
  opcion_seleccionada   int,          -- índice elegido por el usuario, null si no respondió
  es_correcta           boolean not null
);

create index idx_simulador_respuestas_simulador on simulador_respuestas(simulador_id);
