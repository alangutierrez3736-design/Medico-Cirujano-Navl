// ============================================================
// EXAMOTECA — Cliente de Supabase
// ============================================================
// Requiere las variables de entorno (ver .env.example):
//   VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY
//
// Instalación: npm install @supabase/supabase-js

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Faltan VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY. Revisa tu archivo .env"
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Nombre del bucket de Storage donde se guardan los PDFs.
// Créalo en Supabase Dashboard → Storage → New bucket → "documentos-pdf" (privado).
export const BUCKET_PDFS = "documentos-pdf";
export const BUCKET_PORTADAS = "portadas-pdf";
