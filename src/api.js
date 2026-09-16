// ============================================================
// EXAMOTECA — Capa de acceso a datos (reemplaza el estado en
// memoria del prototipo por llamadas reales a Supabase)
// ============================================================
// Cada función corresponde a una acción del frontend. Úsalas
// dentro de tus componentes con useEffect / manejadores de eventos.

import { supabase, BUCKET_PDFS, BUCKET_PORTADAS } from "./supabaseClient";

/* ---------------------------------------------------------
   AUTENTICACIÓN
   --------------------------------------------------------- */

export async function registrarse(email, password, nombre) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  // El trigger de la base de datos (ver 03_triggers.sql) crea el
  // perfil automáticamente; aquí solo lo actualizamos con el nombre.
  if (data.user) {
    await supabase.from("perfiles").update({ nombre }).eq("id", data.user.id);
  }
  return data.user;
}

export async function iniciarSesion(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data.user;
}

export async function cerrarSesion() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function obtenerPerfilActual() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data, error } = await supabase
    .from("perfiles")
    .select("*")
    .eq("id", user.id)
    .single();
  if (error) throw error;
  return data; // incluye .rol ('usuario' | 'admin')
}

/* ---------------------------------------------------------
   BÚSQUEDA Y LISTADO DE DOCUMENTOS
   --------------------------------------------------------- */

export async function buscarDocumentos({
  texto = "", universidadId, carreraId, materiaId, anio, tipo,
  conRespuestas, dificultad, pagina = 0, porPagina = 20,
} = {}) {
  let query = supabase
    .from("documentos")
    .select(`
      id, titulo, slug, anio, tipo, numero_preguntas, tiene_respuestas,
      dificultad, descripcion, etiquetas, archivo_ruta, portada_ruta, es_demo,
      universidades ( id, nombre, slug ),
      carreras ( id, nombre ),
      materias ( id, nombre, slug, icono )
    `, { count: "exact" })
    .eq("publicado", true);

  if (texto) query = query.textSearch("busqueda", texto, { type: "websearch", config: "spanish" });
  if (universidadId) query = query.eq("universidad_id", universidadId);
  if (carreraId) query = query.eq("carrera_id", carreraId);
  if (materiaId) query = query.eq("materia_id", materiaId);
  if (anio) query = query.eq("anio", anio);
  if (tipo) query = query.eq("tipo", tipo);
  if (conRespuestas !== undefined) query = query.eq("tiene_respuestas", conRespuestas);
  if (dificultad) query = query.eq("dificultad", dificultad);

  query = query.order("fecha_agregado", { ascending: false })
               .range(pagina * porPagina, pagina * porPagina + porPagina - 1);

  const { data, error, count } = await query;
  if (error) throw error;
  return { documentos: data, total: count };
}

export async function obtenerDocumentoPorSlug(slug) {
  const { data, error } = await supabase
    .from("documentos")
    .select(`*, universidades(*), carreras(*), materias(*)`)
    .eq("slug", slug)
    .single();
  if (error) throw error;
  return data;
}

// Genera una URL firmada temporal para ver/descargar el PDF real
// (el bucket es privado, así que no hay URLs públicas permanentes).
export async function obtenerUrlDocumento(archivoRuta, segundosValidez = 3600) {
  const { data, error } = await supabase
    .storage.from(BUCKET_PDFS)
    .createSignedUrl(archivoRuta, segundosValidez);
  if (error) throw error;
  return data.signedUrl;
}

/* ---------------------------------------------------------
   CATÁLOGOS (universidades, materias, carreras)
   --------------------------------------------------------- */

export async function listarUniversidades() {
  const { data, error } = await supabase.from("universidades").select("*").order("nombre");
  if (error) throw error;
  return data;
}

export async function listarMaterias() {
  const { data, error } = await supabase.from("materias").select("*").order("nombre");
  if (error) throw error;
  return data;
}

export async function listarCarreras() {
  const { data, error } = await supabase.from("carreras").select("*").order("nombre");
  if (error) throw error;
  return data;
}

/* ---------------------------------------------------------
   FAVORITOS
   --------------------------------------------------------- */

export async function alternarFavoritoDocumento(usuarioId, documentoId) {
  const { data: existente } = await supabase
    .from("favoritos_documentos")
    .select("*")
    .eq("usuario_id", usuarioId)
    .eq("documento_id", documentoId)
    .maybeSingle();

  if (existente) {
    await supabase.from("favoritos_documentos")
      .delete().eq("usuario_id", usuarioId).eq("documento_id", documentoId);
    return false; // ya no es favorito
  } else {
    await supabase.from("favoritos_documentos")
      .insert({ usuario_id: usuarioId, documento_id: documentoId });
    return true; // ahora es favorito
  }
}

export async function listarFavoritos(usuarioId) {
  const { data, error } = await supabase
    .from("favoritos_documentos")
    .select("documentos(*)")
    .eq("usuario_id", usuarioId);
  if (error) throw error;
  return data.map((f) => f.documentos);
}

/* ---------------------------------------------------------
   PREGUNTAS Y SIMULADOR
   --------------------------------------------------------- */

export async function obtenerPreguntasPorMateria(materiaId, cantidad = 10) {
  // Nota: Postgres no tiene un "random balanceado" nativo eficiente para
  // tablas grandes; para un banco pequeño esto es suficiente. Para
  // catálogos grandes, usar una función RPC con TABLESAMPLE.
  const { data, error } = await supabase
    .from("preguntas")
    .select("*")
    .eq("materia_id", materiaId)
    .eq("revisada", true)
    .limit(cantidad * 3); // sobre-pedimos y barajamos en cliente
  if (error) throw error;
  return data.sort(() => Math.random() - 0.5).slice(0, cantidad);
}

export async function guardarResultadoSimulador({
  usuarioId, materiaId, respuestas, preguntas, tiempoLimiteSeg, tiempoUsadoSeg, dificultad,
}) {
  const correctas = preguntas.filter((p, i) => respuestas[i] === p.respuesta_correcta).length;
  const porcentaje = Math.round((correctas / preguntas.length) * 10000) / 100;

  const { data: simulador, error } = await supabase
    .from("simuladores_realizados")
    .insert({
      usuario_id: usuarioId,
      materia_id: materiaId,
      numero_preguntas: preguntas.length,
      correctas,
      porcentaje,
      tiempo_limite_seg: tiempoLimiteSeg,
      tiempo_usado_seg: tiempoUsadoSeg,
      dificultad,
    })
    .select()
    .single();
  if (error) throw error;

  const detalle = preguntas.map((p, i) => ({
    simulador_id: simulador.id,
    pregunta_id: p.id,
    opcion_seleccionada: respuestas[i] ?? null,
    es_correcta: respuestas[i] === p.respuesta_correcta,
  }));
  await supabase.from("simulador_respuestas").insert(detalle);

  return simulador;
}

export async function obtenerHistorial(usuarioId) {
  const { data, error } = await supabase
    .from("simuladores_realizados")
    .select("*, materias(nombre)")
    .eq("usuario_id", usuarioId)
    .order("realizado_en", { ascending: false });
  if (error) throw error;
  return data;
}

/* ---------------------------------------------------------
   ADMINISTRACIÓN: subir documento + preguntas
   --------------------------------------------------------- */

export async function subirDocumentoPdf({ archivo, metadatos, usuarioId }) {
  const rutaArchivo = `${usuarioId}/${Date.now()}-${archivo.name}`;

  const { error: errorSubida } = await supabase.storage
    .from(BUCKET_PDFS)
    .upload(rutaArchivo, archivo, { contentType: "application/pdf" });
  if (errorSubida) throw errorSubida;

  const slug = metadatos.titulo
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  const { data, error } = await supabase
    .from("documentos")
    .insert({
      ...metadatos,
      slug,
      archivo_ruta: rutaArchivo,
      subido_por: usuarioId,
      publicado: false, // el admin lo revisa y publica manualmente
      es_demo: false,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function publicarDocumento(documentoId) {
  const { error } = await supabase
    .from("documentos")
    .update({ publicado: true })
    .eq("id", documentoId);
  if (error) throw error;
}

export async function eliminarDocumento(documentoId, archivoRuta) {
  await supabase.storage.from(BUCKET_PDFS).remove([archivoRuta]);
  const { error } = await supabase.from("documentos").delete().eq("id", documentoId);
  if (error) throw error;
}

// Guarda preguntas ya revisadas por el administrador (origen: manual
// o extraccion_automatica, pero siempre con revisada = true al publicarlas).
export async function guardarPreguntasRevisadas(documentoId, materiaId, preguntas) {
  const filas = preguntas.map((p) => ({
    documento_id: documentoId,
    materia_id: materiaId,
    enunciado: p.enunciado,
    opciones: p.opciones,
    respuesta_correcta: p.respuestaCorrecta,
    explicacion: p.explicacion || null,
    origen: p.origen || "manual",
    revisada: true,
  }));
  const { error } = await supabase.from("preguntas").insert(filas);
  if (error) throw error;
}
