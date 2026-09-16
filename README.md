# Examoteca — Preparación para la Escuela Médico Naval (SEDEMAR)

Plataforma enfocada en el proceso de admisión a la **Escuela Médico Naval**
(Secretaría de Marina), con materias comunes guiadas por el EXANI-II, un
banco de preguntas por materia y un apartado de examen psicométrico.

## 📚 Contenido del banco de preguntas

`src/questionsData.js` contiene **340 preguntas originales, con explicación**,
escritas específicamente para esta plataforma (no son reactivos reales de
ningún examen oficial de CENEVAL ni de ninguna institución militar; usarlas
así sería tanto un problema legal como, más importante, una mala forma de
prepararte). Distribución:

| Materia | Preguntas |
|---|---|
| Matemáticas | 30 |
| Física, Química, Biología, Medicina, Anatomía, Historia | 25 c/u |
| Fisiología, Idiomas, Informática, Ingeniería, Otras, Psicología | 20 c/u |
| Admisión (plantel militar de medicina, enfoque EXANI-II) | 25 |
| Examen psicométrico (práctica de formato) | 15 |

El apartado de **examen psicométrico** es material de práctica de formato
(razonamiento lógico/verbal/numérico y juicio situacional). No es un
instrumento psicológico validado ni sustituye una evaluación psicométrica
profesional real — el simulador lo señala explícitamente al elegirlo.

Los **documentos PDF** que se muestran como tarjetas (universidad, carrera,
año, etc.) siguen siendo de ejemplo, marcados "DEMO — Documento de
ejemplo", porque no hay archivos PDF reales cargados en el backend todavía.

## ▶ Uso inmediato (sin configurar nada)

Esto funciona ahora mismo, sin cuenta ni servicio externo. Los datos viven
en la memoria del navegador: se reinician al recargar la página. Para que
persistan de verdad (y para que el banco de preguntas pueda seguir
creciendo sin límite), sigue la sección "Conectar datos reales" más abajo.

```bash
npm install
npm run dev
```

Abre `http://localhost:5173`. Ya puedes:

- Buscar y filtrar documentos (universidad, carrera, año, tipo, respuestas, dificultad).
- Abrir la ficha de un documento y su visor de demostración.
- Responder preguntas de práctica con retroalimentación inmediata.
- Crear y correr un simulador con temporizador, y ver tu calificación y revisión.
- Guardar favoritos y consultar tu historial de simuladores (de esta sesión).
- Entrar al panel de administrador y "publicar" un documento de prueba
  (se agrega a la lista de esta sesión; no se guarda de forma permanente).

## 🚀 Publicarla en internet (para que cualquiera la use, no solo tú en local)

Con el modo demo de arriba, ya es una app real de React que puedes subir a
un hosting gratuito en minutos, sin backend:

1. Sube esta carpeta a un repositorio de GitHub.
2. Entra a [vercel.com](https://vercel.com) (o [netlify.com](https://netlify.com)), conecta el repositorio.
3. Framework preset: **Vite**. Comando de build: `npm run build`. Carpeta de salida: `dist`.
4. Despliega. Obtendrás una URL pública (ej. `examoteca.vercel.app`) funcionando en modo demo para cualquier visitante.

Esto es lo más rápido para tener la página "ya funcional de manera
inmediata" en una URL real. Los pasos de abajo son para cuando quieras
que los datos sean reales y persistentes (subir tus propios PDFs, cuentas
de usuario, favoritos que no se pierdan, etc.).

## 🗄 Conectar datos reales (Supabase: base de datos + autenticación + almacenamiento)

El prototipo en modo demo usa datos en memoria a propósito, para que
funcionara de inmediato sin pedirte credenciales. Cuando quieras
persistencia real:

1. Crea un proyecto gratuito en [supabase.com](https://supabase.com).
2. En el **SQL Editor** del proyecto, ejecuta en orden:
   - `backend/01_schema.sql` (tablas: documentos, materias, universidades, carreras, preguntas, favoritos, historial).
   - `backend/02_rls_policies.sql` (seguridad: solo el admin puede subir/editar/eliminar documentos y preguntas; cada usuario solo ve y modifica sus propios favoritos e historial).
3. En **Storage**, crea un bucket privado llamado `documentos-pdf` (y opcionalmente `portadas-pdf`).
4. En **Authentication**, activa el proveedor de correo/contraseña (o el que prefieras).
5. Para volver administrador a tu propio usuario: regístrate una vez en la app, luego en el SQL Editor ejecuta:
   ```sql
   update perfiles set rol = 'admin' where id = 'TU-USER-ID-DE-AUTH';
   ```
6. Copia `.env.example` a `.env` y llena `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` (Supabase Dashboard → Project Settings → API).
7. En `src/App.jsx`, reemplaza el estado en memoria por las funciones ya
   escritas en `src/api.js` (por ejemplo, `buscarDocumentos()` en vez del
   arreglo `INITIAL_PDFS`, `alternarFavoritoDocumento()` en vez de
   `toggleFavorite`, `guardarResultadoSimulador()` al terminar un
   simulador, etc.). Cada función de `src/api.js` tiene un comentario
   que indica a qué acción del frontend corresponde.

A partir de ahí, los documentos que subas desde el panel de administrador
quedan guardados de verdad, los favoritos y el historial persisten por
usuario, y el acceso al panel de administrador queda protegido por
autenticación real (nadie puede editar el catálogo sin haber iniciado
sesión con una cuenta marcada `rol = 'admin'`).

## 📄 Visor de PDF real

El visor actual es un marcador de posición (no hay archivos PDF reales
que mostrar en el modo demo). Cuando conectes Supabase Storage:

```bash
npm install react-pdf
```

Y en el componente `PdfDetailPage`, sustituye el bloque del visor por
`<Document file={urlFirmada}><Page pageNumber={1} /></Document>` de
`react-pdf`, usando `obtenerUrlDocumento()` de `src/api.js` para obtener
la URL firmada temporal del archivo real.

## 🔍 Extracción automática de preguntas

La vista previa del panel de administrador es ilustrativa. Una
extracción real requiere una función de servidor (Supabase Edge
Function o un backend Node) que:

1. Lea el texto del PDF (ej. con `pdf-parse` o `pdfjs-dist` en el servidor).
2. Busque patrones de pregunta/opciones A-D (o use un modelo de lenguaje para estructurarlas).
3. Devuelva las preguntas candidatas al panel para que el administrador las revise, edite y apruebe antes de guardarlas con `guardarPreguntasRevisadas()`.

## 🏗 Estructura del proyecto

```
examoteca-app/
├── index.html
├── package.json
├── vite.config.js
├── .env.example
├── src/
│   ├── main.jsx
│   ├── App.jsx           ← toda la interfaz (modo demo, listo para usar)
│   ├── index.css
│   ├── supabaseClient.js ← conexión a Supabase (opcional)
│   └── api.js            ← funciones de datos reales (opcional)
└── backend/
    ├── 01_schema.sql      ← tablas de la base de datos
    └── 02_rls_policies.sql← reglas de seguridad (quién puede leer/escribir qué)
```

## ⚠️ Sobre el contenido de ejemplo

Todos los documentos y preguntas incluidos están marcados como
"DEMO — Documento de ejemplo" y son ficticios. No representan
materiales reales de las universidades listadas. Antes de publicar
documentos reales, asegúrate de tener el permiso correspondiente para
distribuirlos.
