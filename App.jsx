import React, { useState, useMemo, useEffect } from "react";
import {
  Search, BookOpen, GraduationCap, Building2, Menu, X, Star,
  Download, Eye, Maximize2, ArrowLeft, Clock, CheckCircle2, XCircle,
  ChevronDown, ChevronRight, Upload, Trash2, Pencil, ShieldCheck,
  History as HistoryIcon, Bookmark, Filter, Sparkles, FileText, Timer
} from "lucide-react";
import { QUESTION_BANK_FULL } from "./questionsData.js";

/* ============================================================
   FONTS — cargadas en index.html (ver <link> de Google Fonts).
   Las clases .font-serif-brand y .font-ui se definen en src/index.css
   ============================================================ */

/* ============================================================
   DEMO DATA  — all entries are clearly marked isDemo: true
   ============================================================ */

const CATEGORIES = [
  { id: "matematicas", label: "Matemáticas", icon: "∑" },
  { id: "fisica", label: "Física", icon: "⚛" },
  { id: "quimica", label: "Química", icon: "⚗" },
  { id: "biologia", label: "Biología", icon: "❦" },
  { id: "medicina", label: "Medicina", icon: "✚" },
  { id: "anatomia", label: "Anatomía", icon: "☰" },
  { id: "fisiologia", label: "Fisiología", icon: "◐" },
  { id: "historia", label: "Historia", icon: "⌛" },
  { id: "ingenieria", label: "Ingeniería", icon: "⚙" },
  { id: "informatica", label: "Informática", icon: "◧" },
  { id: "psicologia", label: "Psicología", icon: "◔" },
  { id: "idiomas", label: "Idiomas", icon: "✎" },
  { id: "admision", label: "Admisión — plantel militar de medicina", icon: "★" },
  { id: "psicometrico", label: "Examen psicométrico", icon: "◈" },
  { id: "otras", label: "Otras materias", icon: "…" },
];

const UNIVERSITIES = [
  "Escuela Médico Naval (SEDEMAR — Secretaría de Marina)",
];

let _id = 100;
const nextId = () => String(_id++);

const mkPdf = (o) => ({
  id: nextId(),
  isDemo: true,
  tags: [],
  numeroPreguntas: 0,
  tieneRespuestas: false,
  dificultad: "Intermedia",
  descripcion: "",
  fechaAgregado: "2026-01-15",
  ...o,
});

const INITIAL_PDFS = [
  mkPdf({
    titulo: "Guía de Biología Celular para Admisión — Escuela Médico Naval",
    universidad: "Escuela Médico Naval (SEDEMAR — Secretaría de Marina)",
    carrera: "Médico Cirujano Naval",
    materia: "biologia",
    materiaLabel: "Biología",
    anio: 2026,
    tipo: "Guía de estudio",
    numeroPreguntas: 80,
    tieneRespuestas: true,
    dificultad: "Intermedia",
    descripcion: "Material de repaso sobre membrana celular, organelos y metabolismo, orientado al módulo de área de la salud del EXANI-II.",
    tags: ["célula", "membrana", "organelos", "EXANI-II"],
  }),
  mkPdf({
    titulo: "Banco de Preguntas de Química General — Preparación EXANI-II",
    universidad: "Escuela Médico Naval (SEDEMAR — Secretaría de Marina)",
    carrera: "Médico Cirujano Naval",
    materia: "quimica",
    materiaLabel: "Química",
    anio: 2026,
    tipo: "Banco de preguntas",
    numeroPreguntas: 120,
    tieneRespuestas: true,
    dificultad: "Difícil",
    descripcion: "Reactivos de estequiometría, enlace químico y termodinámica básica con clave de respuestas, alineados al módulo común del EXANI-II.",
    tags: ["estequiometría", "enlace químico", "EXANI-II"],
  }),
  mkPdf({
    titulo: "Simulador de Admisión — Escuela Médico Naval",
    universidad: "Escuela Médico Naval (SEDEMAR — Secretaría de Marina)",
    carrera: "Médico Cirujano Naval",
    materia: "admision",
    materiaLabel: "Admisión — plantel militar de medicina",
    anio: 2026,
    tipo: "Simulador de examen",
    numeroPreguntas: 150,
    tieneRespuestas: true,
    dificultad: "Difícil",
    descripcion: "Simulador integral con secciones de biología, química, física, razonamiento verbal y matemático, siguiendo la estructura del EXANI-II.",
    tags: ["admisión", "área de la salud", "EXANI-II"],
  }),
  mkPdf({
    titulo: "Cuestionario de Anatomía — Sistema Nervioso",
    universidad: "Escuela Médico Naval (SEDEMAR — Secretaría de Marina)",
    carrera: "Médico Cirujano Naval",
    materia: "anatomia",
    materiaLabel: "Anatomía",
    anio: 2026,
    tipo: "Cuestionario",
    numeroPreguntas: 60,
    tieneRespuestas: true,
    dificultad: "Difícil",
    descripcion: "Preguntas de opción múltiple sobre sistema nervioso central y periférico, para reforzar el módulo de ciencias de la salud.",
    tags: ["sistema nervioso", "neuroanatomía"],
  }),
  mkPdf({
    titulo: "Examen de Matemáticas — Módulo Común EXANI-II",
    universidad: "Escuela Médico Naval (SEDEMAR — Secretaría de Marina)",
    carrera: "Médico Cirujano Naval",
    materia: "matematicas",
    materiaLabel: "Matemáticas",
    anio: 2026,
    tipo: "Examen de admisión",
    numeroPreguntas: 40,
    tieneRespuestas: true,
    dificultad: "Intermedia",
    descripcion: "Reactivos de pensamiento matemático (álgebra, geometría y razonamiento numérico) propios del módulo común del EXANI-II.",
    tags: ["pensamiento matemático", "EXANI-II"],
  }),
  mkPdf({
    titulo: "Banco de Reactivos de Fisiología Renal",
    universidad: "Escuela Médico Naval (SEDEMAR — Secretaría de Marina)",
    carrera: "Médico Cirujano Naval",
    materia: "fisiologia",
    materiaLabel: "Fisiología",
    anio: 2026,
    tipo: "Banco de preguntas",
    numeroPreguntas: 70,
    tieneRespuestas: true,
    dificultad: "Difícil",
    descripcion: "Reactivos sobre filtración glomerular, reabsorción tubular y equilibrio ácido-base.",
    tags: ["riñón", "equilibrio ácido-base"],
  }),
  mkPdf({
    titulo: "Cultura General y Cívica — Preparación para Aspirantes",
    universidad: "Escuela Médico Naval (SEDEMAR — Secretaría de Marina)",
    carrera: "Médico Cirujano Naval",
    materia: "otras",
    materiaLabel: "Otras materias",
    anio: 2026,
    tipo: "Guía de estudio",
    numeroPreguntas: 35,
    tieneRespuestas: true,
    dificultad: "Fácil",
    descripcion: "Repaso de cultura general útil para el módulo de conocimientos generales del proceso de admisión.",
    tags: ["cultura general"],
  }),
  mkPdf({
    titulo: "Cuestionario de Psicología General",
    universidad: "Escuela Médico Naval (SEDEMAR — Secretaría de Marina)",
    carrera: "Médico Cirujano Naval",
    materia: "psicologia",
    materiaLabel: "Psicología",
    anio: 2026,
    tipo: "Cuestionario",
    numeroPreguntas: 45,
    tieneRespuestas: true,
    dificultad: "Intermedia",
    descripcion: "Preguntas introductorias de psicología general, como apoyo previo al examen psicométrico del proceso de admisión.",
    tags: ["psicología general"],
  }),
  mkPdf({
    titulo: "Historia de México — Repaso para Aspirantes",
    universidad: "Escuela Médico Naval (SEDEMAR — Secretaría de Marina)",
    carrera: "Médico Cirujano Naval",
    materia: "historia",
    materiaLabel: "Historia",
    anio: 2026,
    tipo: "Guía de estudio",
    numeroPreguntas: 55,
    tieneRespuestas: true,
    dificultad: "Intermedia",
    descripcion: "Repaso de historia de México relevante para el módulo de conocimientos generales del proceso de admisión.",
    tags: ["historia de México"],
  }),
  mkPdf({
    titulo: "Examen de Física — Módulo Común EXANI-II",
    universidad: "Escuela Médico Naval (SEDEMAR — Secretaría de Marina)",
    carrera: "Médico Cirujano Naval",
    materia: "fisica",
    materiaLabel: "Física",
    anio: 2026,
    tipo: "Examen de admisión",
    numeroPreguntas: 42,
    tieneRespuestas: true,
    dificultad: "Difícil",
    descripcion: "Preguntas de mecánica, energía y electricidad básica, propias del módulo común del EXANI-II.",
    tags: ["cinemática", "dinámica", "EXANI-II"],
  }),
];

/* Banco de preguntas real (340 preguntas originales, 15 materias),
   escrito específicamente para esta plataforma. Ver src/questionsData.js */
const QUESTION_BANK = QUESTION_BANK_FULL;

const SUBJECT_LABELS = Object.fromEntries(CATEGORIES.map(c => [c.id, c.label]));

/* ============================================================
   SMALL UI PRIMITIVES
   ============================================================ */

const Pill = ({ children, tone = "neutral" }) => {
  const tones = {
    neutral: "bg-[#EDE7D8] text-[#1C2B4A]",
    gold: "bg-[#B8862E]/15 text-[#8a651f]",
    green: "bg-[#2F6F5E]/15 text-[#215347]",
    navy: "bg-[#1C2B4A]/10 text-[#1C2B4A]",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium font-ui ${tones[tone]}`}>
      {children}
    </span>
  );
};

const DemoBadge = () => (
  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-[#B8862E]/40 bg-[#B8862E]/10 text-[10px] font-semibold tracking-wide text-[#8a651f] font-ui">
    DEMO — Documento de ejemplo
  </span>
);

// A diferencia de los documentos PDF (que sí son ficticios, ver DemoBadge),
// el banco de preguntas es contenido real y original escrito para esta
// plataforma — no son reactivos de ningún examen oficial existente.
const OriginalBadge = () => (
  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-[#2F6F5E]/40 bg-[#2F6F5E]/10 text-[10px] font-semibold tracking-wide text-[#215347] font-ui">
    Contenido original de la plataforma
  </span>
);

const DifficultyDot = ({ level }) => {
  const color = level === "Fácil" ? "#2F6F5E" : level === "Difícil" ? "#B23A2F" : "#B8862E";
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-ui text-[#5b5646]">
      <span className="w-2 h-2 rounded-full" style={{ background: color }} />
      {level}
    </span>
  );
};

const Button = ({ children, variant = "primary", className = "", ...props }) => {
  const base = "inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-semibold font-ui transition-colors";
  const variants = {
    primary: "bg-[#1C2B4A] text-[#F3EFE6] hover:bg-[#14213b]",
    gold: "bg-[#B8862E] text-white hover:bg-[#9c711f]",
    outline: "border border-[#1C2B4A]/25 text-[#1C2B4A] hover:bg-[#1C2B4A]/5",
    ghost: "text-[#1C2B4A] hover:bg-[#1C2B4A]/5",
  };
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

/* ============================================================
   HEADER
   ============================================================ */

const Header = ({ query, setQuery, onSearch, onNavigate, current }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navItems = [
    { id: "home", label: "Inicio" },
    { id: "practice", label: "Preguntas de práctica" },
    { id: "simulatorSetup", label: "Simulador" },
    { id: "favorites", label: "Mis favoritos" },
    { id: "history", label: "Historial" },
    { id: "admin", label: "Administrador" },
  ];
  return (
    <header className="bg-[#1C2B4A] text-[#F3EFE6] sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-4">
        <button onClick={() => onNavigate("home")} className="flex items-center gap-2 shrink-0">
          <span className="w-9 h-9 rounded bg-[#B8862E] text-[#1C2B4A] flex items-center justify-center font-serif-brand font-bold text-lg">E</span>
          <span className="font-serif-brand text-xl font-semibold hidden sm:block">Examoteca</span>
        </button>

        <form
          onSubmit={(e) => { e.preventDefault(); onSearch(); }}
          className="flex-1 flex items-center bg-[#F3EFE6] rounded-md overflow-hidden"
        >
          <Search size={18} className="ml-3 text-[#1C2B4A]/50 shrink-0" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar examen, universidad, materia, tema…"
            className="w-full px-2 py-2 text-sm text-[#1C2B4A] bg-transparent outline-none font-ui"
          />
          <button type="submit" className="hidden sm:block px-4 py-2 text-sm font-semibold text-[#1C2B4A] font-ui">
            Buscar
          </button>
        </form>

        <nav className="hidden lg:flex items-center gap-1 shrink-0">
          {navItems.slice(1).map((n) => (
            <button
              key={n.id}
              onClick={() => onNavigate(n.id)}
              className={`px-3 py-2 rounded text-sm font-ui ${current === n.id ? "bg-white/10 font-semibold" : "hover:bg-white/5"}`}
            >
              {n.label}
            </button>
          ))}
        </nav>

        <button className="lg:hidden shrink-0" onClick={() => setMenuOpen((v) => !v)}>
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {menuOpen && (
        <div className="lg:hidden border-t border-white/10 px-4 py-2 flex flex-col">
          {navItems.map((n) => (
            <button
              key={n.id}
              onClick={() => { onNavigate(n.id); setMenuOpen(false); }}
              className="text-left px-2 py-2.5 text-sm font-ui border-b border-white/5 last:border-0"
            >
              {n.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
};

/* ============================================================
   HOME: HERO + CATEGORIES
   ============================================================ */

const Hero = ({ query, setQuery, onSearch }) => (
  <div className="bg-[#F3EFE6] border-b border-[#1C2B4A]/10">
    <div className="max-w-6xl mx-auto px-4 py-12">
      <p className="font-ui text-sm tracking-wide text-[#8a651f] mb-3">Preparación de admisión · Escuela Médico Naval</p>
      <h1 className="font-serif-brand text-3xl sm:text-4xl text-[#1C2B4A] max-w-2xl leading-tight">
        Tu plataforma de estudio para ingresar a la Escuela Médico Naval
      </h1>
      <p className="font-ui text-[#3d3a2e] mt-3 max-w-xl">
        Materias comunes del EXANI-II, práctica psicométrica y bancos de preguntas enfocados en el proceso
        de admisión de la Escuela Médico Naval (SEDEMAR — Secretaría de Marina).
      </p>
      <form
        onSubmit={(e) => { e.preventDefault(); onSearch(); }}
        className="mt-6 flex flex-col sm:flex-row gap-2 max-w-xl"
      >
        <div className="flex-1 flex items-center bg-white rounded-md border border-[#1C2B4A]/15 px-3">
          <Search size={18} className="text-[#1C2B4A]/40" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder='Ej. "examen de biología opción múltiple"'
            className="w-full px-2 py-3 text-sm outline-none font-ui text-[#1C2B4A]"
          />
        </div>
        <Button variant="gold" type="submit" className="py-3">Buscar exámenes</Button>
      </form>
    </div>
  </div>
);

const CategoryGrid = ({ onPick }) => (
  <div className="max-w-6xl mx-auto px-4 py-10">
    <div className="flex items-baseline justify-between mb-4">
      <h2 className="font-serif-brand text-2xl text-[#1C2B4A]">Categorías</h2>
    </div>
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
      {CATEGORIES.map((c) => (
        <button
          key={c.id}
          onClick={() => onPick(c.id)}
          className="text-left bg-white border border-[#1C2B4A]/10 rounded-md px-4 py-3 hover:border-[#B8862E]/50 hover:shadow-sm transition-all"
        >
          <div className="text-xl text-[#B8862E] mb-1 font-serif-brand">{c.icon}</div>
          <div className="font-ui text-sm font-medium text-[#1C2B4A]">{c.label}</div>
        </button>
      ))}
    </div>
  </div>
);

/* ============================================================
   FILTERS
   ============================================================ */

const FilterPanel = ({ filters, setFilters, allPdfs, mobileOpen, setMobileOpen }) => {
  const uniqueUniversities = UNIVERSITIES;
  const uniqueCareers = [...new Set(allPdfs.map((p) => p.carrera))];
  const uniqueTypes = [...new Set(allPdfs.map((p) => p.tipo))];
  const uniqueYears = [...new Set(allPdfs.map((p) => p.anio))].sort((a, b) => b - a);

  const Section = ({ label, children }) => (
    <div className="py-4 border-b border-[#1C2B4A]/10">
      <p className="font-ui text-xs font-semibold text-[#1C2B4A]/60 uppercase-none mb-2">{label}</p>
      {children}
    </div>
  );

  const Select = ({ value, onChange, options, placeholder }) => (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full text-sm border border-[#1C2B4A]/15 rounded-md px-2 py-2 bg-white font-ui text-[#1C2B4A]"
    >
      <option value="">{placeholder}</option>
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  );

  const content = (
    <div className="font-ui">
      <Section label="Universidad">
        <Select value={filters.universidad} onChange={(v) => setFilters(f => ({ ...f, universidad: v }))} options={uniqueUniversities} placeholder="Todas" />
      </Section>
      <Section label="Carrera">
        <Select value={filters.carrera} onChange={(v) => setFilters(f => ({ ...f, carrera: v }))} options={uniqueCareers} placeholder="Todas" />
      </Section>
      <Section label="Año">
        <Select value={filters.anio} onChange={(v) => setFilters(f => ({ ...f, anio: v }))} options={uniqueYears} placeholder="Todos" />
      </Section>
      <Section label="Tipo de examen">
        <Select value={filters.tipo} onChange={(v) => setFilters(f => ({ ...f, tipo: v }))} options={uniqueTypes} placeholder="Todos" />
      </Section>
      <Section label="Respuestas">
        <div className="flex gap-2">
          {["Todos", "Con respuestas", "Sin respuestas"].map((v) => (
            <button
              key={v}
              onClick={() => setFilters(f => ({ ...f, respuestas: v }))}
              className={`px-2.5 py-1.5 rounded-md text-xs border ${filters.respuestas === v ? "bg-[#1C2B4A] text-white border-[#1C2B4A]" : "border-[#1C2B4A]/15 text-[#1C2B4A]"}`}
            >
              {v}
            </button>
          ))}
        </div>
      </Section>
      <Section label="Dificultad">
        <div className="flex flex-wrap gap-2">
          {["Todas", "Fácil", "Intermedia", "Difícil"].map((v) => (
            <button
              key={v}
              onClick={() => setFilters(f => ({ ...f, dificultad: v }))}
              className={`px-2.5 py-1.5 rounded-md text-xs border ${filters.dificultad === v ? "bg-[#1C2B4A] text-white border-[#1C2B4A]" : "border-[#1C2B4A]/15 text-[#1C2B4A]"}`}
            >
              {v}
            </button>
          ))}
        </div>
      </Section>
      <button
        onClick={() => setFilters({ universidad: "", carrera: "", anio: "", tipo: "", respuestas: "Todos", dificultad: "Todas" })}
        className="mt-4 text-sm text-[#B23A2F] font-medium"
      >
        Limpiar filtros
      </button>
    </div>
  );

  return (
    <>
      <div className="hidden lg:block w-64 shrink-0 bg-white border border-[#1C2B4A]/10 rounded-md px-4">
        {content}
      </div>
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/30" onClick={() => setMobileOpen(false)}>
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-[#F3EFE6] p-4 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-2">
              <p className="font-serif-brand text-lg text-[#1C2B4A]">Filtros</p>
              <button onClick={() => setMobileOpen(false)}><X size={20} /></button>
            </div>
            {content}
          </div>
        </div>
      )}
    </>
  );
};

/* ============================================================
   PDF CARD + RESULTS
   ============================================================ */

const PdfCard = ({ pdf, onOpen, favorites, toggleFavorite }) => {
  const isFav = favorites.has(pdf.id);
  return (
    <div className="bg-[#FBF9F3] border border-[#1C2B4A]/10 rounded-md overflow-hidden flex flex-col hover:shadow-md transition-shadow">
      <button onClick={() => onOpen(pdf.id)} className="text-left">
        <div className="h-32 bg-gradient-to-br from-[#1C2B4A] to-[#2c3f66] flex items-center justify-center relative">
          <FileText size={36} className="text-[#F3EFE6]/70" />
          <div className="absolute top-2 left-2"><DemoBadge /></div>
        </div>
      </button>
      <div className="p-4 flex-1 flex flex-col gap-2">
        <button onClick={() => onOpen(pdf.id)} className="text-left">
          <h3 className="font-serif-brand text-base text-[#1C2B4A] leading-snug">{pdf.titulo}</h3>
        </button>
        <p className="text-xs font-ui text-[#5b5646] flex items-center gap-1">
          <Building2 size={12} /> {pdf.universidad}
        </p>
        <div className="flex flex-wrap gap-1.5 mt-1">
          <Pill tone="navy">{pdf.materiaLabel}</Pill>
          <Pill>{pdf.carrera}</Pill>
          <Pill>{pdf.anio}</Pill>
        </div>
        <div className="flex items-center justify-between mt-2 text-xs font-ui">
          <span className="text-[#5b5646]">{pdf.numeroPreguntas} preguntas · {pdf.tipo}</span>
        </div>
        <div className="flex items-center justify-between">
          {pdf.tieneRespuestas ? <Pill tone="green">Con respuestas</Pill> : <Pill>Sin respuestas</Pill>}
          <DifficultyDot level={pdf.dificultad} />
        </div>
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[#1C2B4A]/10">
          <Button variant="outline" className="flex-1 !py-1.5 !text-xs" onClick={() => onOpen(pdf.id)}>
            <Eye size={14} /> Ver PDF
          </Button>
          <Button variant="ghost" className="!px-2 !py-1.5" onClick={() => alert("DEMO: la descarga real requiere un archivo almacenado en el backend.")}>
            <Download size={14} />
          </Button>
          <button
            onClick={() => toggleFavorite(pdf.id)}
            className={`p-1.5 rounded-md border ${isFav ? "bg-[#B8862E]/15 border-[#B8862E]/40 text-[#8a651f]" : "border-[#1C2B4A]/15 text-[#1C2B4A]/50"}`}
            title="Guardar"
          >
            <Star size={14} fill={isFav ? "#B8862E" : "none"} />
          </button>
        </div>
      </div>
    </div>
  );
};

const ResultsGrid = ({ pdfs, onOpen, favorites, toggleFavorite, emptyLabel }) => (
  pdfs.length === 0 ? (
    <div className="text-center py-16 font-ui text-[#5b5646]">
      <p className="font-serif-brand text-lg text-[#1C2B4A] mb-1">Sin resultados</p>
      <p className="text-sm">{emptyLabel || "Ajusta la búsqueda o los filtros para encontrar documentos."}</p>
    </div>
  ) : (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {pdfs.map((p) => (
        <PdfCard key={p.id} pdf={p} onOpen={onOpen} favorites={favorites} toggleFavorite={toggleFavorite} />
      ))}
    </div>
  )
);

/* ============================================================
   SEARCH / RESULTS PAGE
   ============================================================ */

const ResultsPage = ({ pdfs, query, filters, setFilters, onOpen, favorites, toggleFavorite }) => {
  const [mobileFilters, setMobileFilters] = useState(false);

  const filtered = useMemo(() => {
    return pdfs.filter((p) => {
      if (query) {
        const q = query.toLowerCase();
        const hay = [p.titulo, p.universidad, p.materiaLabel, p.carrera, String(p.anio), ...(p.tags || [])]
          .join(" ").toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (filters.universidad && p.universidad !== filters.universidad) return false;
      if (filters.carrera && p.carrera !== filters.carrera) return false;
      if (filters.anio && String(p.anio) !== String(filters.anio)) return false;
      if (filters.tipo && p.tipo !== filters.tipo) return false;
      if (filters.respuestas === "Con respuestas" && !p.tieneRespuestas) return false;
      if (filters.respuestas === "Sin respuestas" && p.tieneRespuestas) return false;
      if (filters.dificultad !== "Todas" && p.dificultad !== filters.dificultad) return false;
      return true;
    });
  }, [pdfs, query, filters]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-serif-brand text-2xl text-[#1C2B4A]">
            {query ? `Resultados para "${query}"` : "Todos los documentos"}
          </h2>
          <p className="text-sm font-ui text-[#5b5646]">{filtered.length} documentos encontrados</p>
        </div>
        <Button variant="outline" className="lg:hidden" onClick={() => setMobileFilters(true)}>
          <Filter size={16} /> Filtros
        </Button>
      </div>
      <div className="flex gap-6">
        <FilterPanel filters={filters} setFilters={setFilters} allPdfs={pdfs} mobileOpen={mobileFilters} setMobileOpen={setMobileFilters} />
        <div className="flex-1">
          <ResultsGrid pdfs={filtered} onOpen={onOpen} favorites={favorites} toggleFavorite={toggleFavorite} />
        </div>
      </div>
    </div>
  );
};

/* ============================================================
   PDF DETAIL PAGE + VIEWER
   ============================================================ */

const PdfDetailPage = ({ pdf, onBack, favorites, toggleFavorite, addHistory }) => {
  const [fullscreen, setFullscreen] = useState(false);
  if (!pdf) return null;
  const isFav = favorites.has(pdf.id);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <button onClick={onBack} className="flex items-center gap-1.5 text-sm font-ui text-[#1C2B4A] mb-4">
        <ArrowLeft size={16} /> Volver a los resultados
      </button>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className={`bg-[#1C2B4A] rounded-md flex flex-col items-center justify-center text-center p-10 ${fullscreen ? "fixed inset-4 z-50" : "h-[480px]"}`}>
            {fullscreen && (
              <button onClick={() => setFullscreen(false)} className="absolute top-4 right-4 text-white"><X size={22} /></button>
            )}
            <FileText size={48} className="text-[#F3EFE6]/60 mb-4" />
            <p className="font-ui text-[#F3EFE6]/80 text-sm max-w-sm">
              Visor de PDF de demostración. En producción, este panel incrusta el archivo real
              (por ejemplo con PDF.js) para lectura sin descarga.
            </p>
            <DemoBadge />
          </div>
          {!fullscreen && (
            <div className="flex gap-2 mt-3">
              <Button variant="outline" onClick={() => setFullscreen(true)}><Maximize2 size={16} /> Pantalla completa</Button>
              <Button variant="outline" onClick={() => alert("DEMO: la descarga real requiere un archivo almacenado en el backend.")}><Download size={16} /> Descargar</Button>
            </div>
          )}
        </div>

        <div>
          <DemoBadge />
          <h1 className="font-serif-brand text-2xl text-[#1C2B4A] mt-2 mb-3">{pdf.titulo}</h1>
          <p className="text-sm font-ui text-[#3d3a2e] mb-4">{pdf.descripcion}</p>
          <div className="space-y-2 text-sm font-ui text-[#1C2B4A] border-t border-[#1C2B4A]/10 pt-4">
            <div className="flex justify-between"><span className="text-[#5b5646]">Universidad</span><span className="font-medium text-right">{pdf.universidad}</span></div>
            <div className="flex justify-between"><span className="text-[#5b5646]">Carrera</span><span className="font-medium">{pdf.carrera}</span></div>
            <div className="flex justify-between"><span className="text-[#5b5646]">Materia</span><span className="font-medium">{pdf.materiaLabel}</span></div>
            <div className="flex justify-between"><span className="text-[#5b5646]">Año</span><span className="font-medium">{pdf.anio}</span></div>
            <div className="flex justify-between"><span className="text-[#5b5646]">Tipo</span><span className="font-medium">{pdf.tipo}</span></div>
            <div className="flex justify-between"><span className="text-[#5b5646]">Preguntas</span><span className="font-medium">{pdf.numeroPreguntas}</span></div>
            <div className="flex justify-between"><span className="text-[#5b5646]">Respuestas</span><span className="font-medium">{pdf.tieneRespuestas ? "Sí" : "No"}</span></div>
            <div className="flex justify-between"><span className="text-[#5b5646]">Dificultad</span><DifficultyDot level={pdf.dificultad} /></div>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-4">
            {(pdf.tags || []).map((t) => <Pill key={t}>{t}</Pill>)}
          </div>
          <div className="flex gap-2 mt-5">
            <Button variant="gold" className="flex-1" onClick={() => toggleFavorite(pdf.id)}>
              <Star size={16} fill={isFav ? "white" : "none"} /> {isFav ? "Guardado" : "Guardar"}
            </Button>
          </div>
          <p className="text-xs font-ui text-[#5b5646] mt-6">
            URL de referencia (para SEO): <br />
            <span className="text-[#1C2B4A]">/examenes/{pdf.materia}/{pdf.universidad.toLowerCase().split(" ").slice(0,2).join("-")}/{pdf.id}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

/* ============================================================
   PRACTICE QUESTIONS
   ============================================================ */

const PracticeQuestion = ({ q, onAnswered }) => {
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);

  const submit = () => {
    if (selected === null) return;
    setAnswered(true);
    onAnswered?.(selected === q.correcta);
  };

  return (
    <div className="bg-white border border-[#1C2B4A]/10 rounded-md p-5 font-ui">
      <div className="flex items-center gap-2 mb-3">
        <Pill tone="navy">{SUBJECT_LABELS[q.materia] || q.materia}</Pill>
        <OriginalBadge />
      </div>
      <p className="font-serif-brand text-lg text-[#1C2B4A] mb-4">{q.pregunta}</p>
      <div className="space-y-2">
        {q.opciones.map((op, i) => {
          const letter = String.fromCharCode(65 + i);
          let style = "border-[#1C2B4A]/15";
          if (answered) {
            if (i === q.correcta) style = "border-[#2F6F5E] bg-[#2F6F5E]/10";
            else if (i === selected) style = "border-[#B23A2F] bg-[#B23A2F]/10";
          } else if (selected === i) {
            style = "border-[#1C2B4A] bg-[#1C2B4A]/5";
          }
          return (
            <button
              key={i}
              disabled={answered}
              onClick={() => setSelected(i)}
              className={`w-full text-left px-3 py-2.5 rounded-md border text-sm flex items-start gap-2 ${style}`}
            >
              <span className="font-semibold">{letter})</span> {op}
            </button>
          );
        })}
      </div>
      {!answered ? (
        <Button className="mt-4" onClick={submit} disabled={selected === null}>Responder</Button>
      ) : (
        <div className={`mt-4 p-3 rounded-md text-sm flex gap-2 items-start ${selected === q.correcta ? "bg-[#2F6F5E]/10 text-[#215347]" : "bg-[#B23A2F]/10 text-[#8a2d24]"}`}>
          {selected === q.correcta ? <CheckCircle2 size={18} className="shrink-0 mt-0.5" /> : <XCircle size={18} className="shrink-0 mt-0.5" />}
          <div>
            <p className="font-semibold">{selected === q.correcta ? "Respuesta correcta." : `Respuesta incorrecta. La correcta es ${String.fromCharCode(65 + q.correcta)}.`}</p>
            <p className="mt-1">{q.explicacion}</p>
          </div>
        </div>
      )}
    </div>
  );
};

const PracticePage = ({ favoriteQuestions, toggleFavQuestion }) => {
  const [subjectFilter, setSubjectFilter] = useState("");
  const list = QUESTION_BANK.filter(q => !subjectFilter || q.materia === subjectFilter);
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h2 className="font-serif-brand text-2xl text-[#1C2B4A] mb-1">Preguntas de práctica</h2>
      <p className="text-sm font-ui text-[#5b5646] mb-5">Reactivos extraídos de documentos de ejemplo. Responde y recibe retroalimentación inmediata.</p>
      <select
        value={subjectFilter}
        onChange={(e) => setSubjectFilter(e.target.value)}
        className="mb-5 text-sm border border-[#1C2B4A]/15 rounded-md px-2 py-2 bg-white font-ui text-[#1C2B4A]"
      >
        <option value="">Todas las materias</option>
        {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
      </select>
      <div className="space-y-4">
        {list.map((q) => <PracticeQuestion key={q.id} q={q} />)}
      </div>
    </div>
  );
};

/* ============================================================
   SIMULATOR
   ============================================================ */

const SimulatorSetup = ({ onStart }) => {
  // Solo ofrecemos materias que realmente tienen preguntas en el banco,
  // y mostramos cuántas hay disponibles para que el usuario sepa qué esperar.
  const countsByMateria = useMemo(() => {
    const counts = {};
    QUESTION_BANK.forEach(q => { counts[q.materia] = (counts[q.materia] || 0) + 1; });
    return counts;
  }, []);
  const materiasConPreguntas = CATEGORIES.filter(c => countsByMateria[c.id] > 0);

  const [materia, setMateria] = useState(materiasConPreguntas[0]?.id || "");
  const [numPreguntas, setNumPreguntas] = useState(10);
  const [dificultad, setDificultad] = useState("Intermedia");
  const [conTiempo, setConTiempo] = useState(true);
  const [minutos, setMinutos] = useState(15);

  const disponibles = countsByMateria[materia] || 0;

  return (
    <div className="max-w-lg mx-auto px-4 py-10">
      <h2 className="font-serif-brand text-2xl text-[#1C2B4A] mb-1">Crear simulador</h2>
      <p className="text-sm font-ui text-[#5b5646] mb-6">Arma un examen de práctica con preguntas de nuestro banco de demostración.</p>

      <div className="bg-white border border-[#1C2B4A]/10 rounded-md p-5 font-ui space-y-4">
        <div>
          <label className="text-xs font-semibold text-[#1C2B4A]/60 block mb-1">Materia</label>
          <select value={materia} onChange={e => setMateria(e.target.value)} className="w-full border border-[#1C2B4A]/15 rounded-md px-2 py-2 text-sm">
            {materiasConPreguntas.map(c => (
              <option key={c.id} value={c.id}>{c.label} ({countsByMateria[c.id]} preguntas)</option>
            ))}
          </select>
          <p className="text-xs text-[#5b5646] mt-1">
            Solo se muestran las materias que ya tienen preguntas cargadas en esta demo.
            Las demás categorías del catálogo (Medicina, Economía, Ingeniería, etc.) aún no tienen
            banco de preguntas propio.
          </p>
        </div>
        <div>
          <label className="text-xs font-semibold text-[#1C2B4A]/60 block mb-1">Número de preguntas</label>
          <input
            type="number" min={1} max={50} value={numPreguntas}
            onChange={e => setNumPreguntas(Number(e.target.value))}
            className="w-full border border-[#1C2B4A]/15 rounded-md px-2 py-2 text-sm"
          />
          {numPreguntas > disponibles && (
            <p className="text-xs text-[#B23A2F] mt-1">
              Esta materia solo tiene {disponibles} preguntas únicas; algunas se repetirán para completar {numPreguntas}.
            </p>
          )}
        </div>
        <div>
          <label className="text-xs font-semibold text-[#1C2B4A]/60 block mb-1">Dificultad</label>
          <div className="flex gap-2">
            {["Fácil", "Intermedia", "Difícil"].map(d => (
              <button key={d} onClick={() => setDificultad(d)} className={`px-3 py-1.5 rounded-md text-xs border ${dificultad === d ? "bg-[#1C2B4A] text-white border-[#1C2B4A]" : "border-[#1C2B4A]/15"}`}>{d}</button>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-[#1C2B4A]/60">Límite de tiempo</label>
          <button onClick={() => setConTiempo(v => !v)} className={`w-11 h-6 rounded-full relative transition-colors ${conTiempo ? "bg-[#1C2B4A]" : "bg-[#1C2B4A]/20"}`}>
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${conTiempo ? "translate-x-5" : "translate-x-0"}`} />
          </button>
        </div>
        {conTiempo && (
          <div>
            <label className="text-xs font-semibold text-[#1C2B4A]/60 block mb-1">Minutos</label>
            <input type="number" min={1} max={180} value={minutos} onChange={e => setMinutos(Number(e.target.value))} className="w-full border border-[#1C2B4A]/15 rounded-md px-2 py-2 text-sm" />
          </div>
        )}
        {materia === "psicometrico" && (
          <p className="text-xs text-[#8a651f] bg-[#B8862E]/10 border border-[#B8862E]/30 rounded-md p-2">
            Este apartado es material de práctica de formato (razonamiento y juicio situacional), no un
            instrumento psicológico validado ni un sustituto de una evaluación psicométrica profesional real.
          </p>
        )}
        <Button variant="gold" className="w-full mt-2" onClick={() => onStart({ materia, numPreguntas, dificultad, conTiempo, minutos })}>
          Comenzar examen
        </Button>
        <OriginalBadge />
      </div>
    </div>
  );
};

const SimulatorRun = ({ config, onFinish }) => {
  // Solo usamos preguntas de la materia elegida. Si no hay ninguna, no
  // rellenamos con otras materias: se lo decimos al usuario y no arrancamos.
  const pool = QUESTION_BANK.filter(q => q.materia === config.materia);

  if (pool.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-4 py-10 text-center font-ui">
        <p className="font-serif-brand text-xl text-[#1C2B4A] mb-2">
          "{SUBJECT_LABELS[config.materia] || config.materia}" todavía no tiene preguntas de práctica
        </p>
        <p className="text-sm text-[#5b5646] mb-5">
          Elige otra materia del banco de demostración, o agrega preguntas para esta desde el panel de administrador.
        </p>
        <Button variant="gold" onClick={() => onFinish(null)}>Volver a elegir materia</Button>
      </div>
    );
  }

  // Baraja el conjunto disponible y repite solo dentro de la MISMA materia
  // si se pidieron más preguntas de las que hay únicas.
  const questions = useMemo(() => {
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    const arr = [];
    for (let i = 0; i < config.numPreguntas; i++) arr.push(shuffled[i % shuffled.length]);
    return arr;
  }, []);

  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [secondsLeft, setSecondsLeft] = useState(config.conTiempo ? config.minutos * 60 : null);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    if (secondsLeft === null) return;
    if (secondsLeft <= 0) { finish(); return; }
    const t = setTimeout(() => setSecondsLeft(s => s - 1), 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line
  }, [secondsLeft]);

  const finish = () => {
    const elapsedSec = Math.round((Date.now() - startTime) / 1000);
    onFinish({ questions, answers, elapsedSec });
  };

  const q = questions[idx];
  const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-4 font-ui text-sm text-[#1C2B4A]">
        <span>Pregunta {idx + 1} de {questions.length}</span>
        {secondsLeft !== null && (
          <span className="flex items-center gap-1.5 font-semibold"><Timer size={16} /> {fmt(Math.max(secondsLeft, 0))}</span>
        )}
      </div>
      <div className="w-full h-1.5 bg-[#1C2B4A]/10 rounded-full mb-6">
        <div className="h-1.5 bg-[#B8862E] rounded-full transition-all" style={{ width: `${((idx) / questions.length) * 100}%` }} />
      </div>

      <div className="bg-white border border-[#1C2B4A]/10 rounded-md p-5 font-ui">
        <p className="font-serif-brand text-lg text-[#1C2B4A] mb-4">{q.pregunta}</p>
        <div className="space-y-2">
          {q.opciones.map((op, i) => (
            <button
              key={i}
              onClick={() => setAnswers(a => ({ ...a, [idx]: i }))}
              className={`w-full text-left px-3 py-2.5 rounded-md border text-sm ${answers[idx] === i ? "border-[#1C2B4A] bg-[#1C2B4A]/5" : "border-[#1C2B4A]/15"}`}
            >
              <span className="font-semibold">{String.fromCharCode(65 + i)})</span> {op}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-between mt-5">
        <Button variant="outline" disabled={idx === 0} onClick={() => setIdx(i => i - 1)}>Anterior</Button>
        {idx < questions.length - 1 ? (
          <Button onClick={() => setIdx(i => i + 1)}>Siguiente</Button>
        ) : (
          <Button variant="gold" onClick={finish}>Finalizar examen</Button>
        )}
      </div>
    </div>
  );
};

const SimulatorResults = ({ result, onRestart, onExit }) => {
  const { questions, answers, elapsedSec } = result;
  const correct = questions.filter((q, i) => answers[i] === q.correcta).length;
  const pct = Math.round((correct / questions.length) * 100);
  const fmt = (s) => `${Math.floor(s / 60)} min ${s % 60} s`;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h2 className="font-serif-brand text-2xl text-[#1C2B4A] mb-1">Resultado del simulador</h2>
      <div className="bg-white border border-[#1C2B4A]/10 rounded-md p-6 font-ui my-5 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
        <div><p className="text-2xl font-serif-brand text-[#1C2B4A]">{pct}%</p><p className="text-xs text-[#5b5646]">Calificación</p></div>
        <div><p className="text-2xl font-serif-brand text-[#2F6F5E]">{correct}</p><p className="text-xs text-[#5b5646]">Correctas</p></div>
        <div><p className="text-2xl font-serif-brand text-[#B23A2F]">{questions.length - correct}</p><p className="text-xs text-[#5b5646]">Incorrectas</p></div>
        <div><p className="text-2xl font-serif-brand text-[#1C2B4A]">{fmt(elapsedSec)}</p><p className="text-xs text-[#5b5646]">Tiempo usado</p></div>
      </div>

      <h3 className="font-serif-brand text-lg text-[#1C2B4A] mb-3">Revisión de respuestas</h3>
      <div className="space-y-3">
        {questions.map((q, i) => {
          const ok = answers[i] === q.correcta;
          return (
            <div key={i} className={`p-4 rounded-md border font-ui text-sm ${ok ? "border-[#2F6F5E]/30 bg-[#2F6F5E]/5" : "border-[#B23A2F]/30 bg-[#B23A2F]/5"}`}>
              <p className="font-medium text-[#1C2B4A] mb-1">{i + 1}. {q.pregunta}</p>
              <p className="text-[#3d3a2e]">Tu respuesta: {answers[i] !== undefined ? q.opciones[answers[i]] : "(sin responder)"}</p>
              {!ok && <p className="text-[#215347]">Correcta: {q.opciones[q.correcta]}</p>}
              <p className="text-[#5b5646] mt-1">{q.explicacion}</p>
            </div>
          );
        })}
      </div>

      <div className="flex gap-2 mt-6">
        <Button variant="gold" onClick={onRestart}>Crear otro simulador</Button>
        <Button variant="outline" onClick={onExit}>Ir al inicio</Button>
      </div>
    </div>
  );
};

/* ============================================================
   FAVORITES / HISTORY
   ============================================================ */

const FavoritesPage = ({ pdfs, favorites, toggleFavorite, onOpen }) => {
  const favPdfs = pdfs.filter(p => favorites.has(p.id));
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="font-serif-brand text-2xl text-[#1C2B4A] mb-1">Mis favoritos</h2>
      <p className="text-sm font-ui text-[#5b5646] mb-5">Documentos que has guardado. Se conservan mientras dure esta sesión de demostración.</p>
      <ResultsGrid pdfs={favPdfs} onOpen={onOpen} favorites={favorites} toggleFavorite={toggleFavorite} emptyLabel="Aún no guardas ningún documento. Usa la estrella en una tarjeta para guardarlo aquí." />
    </div>
  );
};

const HistoryPage = ({ history }) => (
  <div className="max-w-3xl mx-auto px-4 py-8">
    <h2 className="font-serif-brand text-2xl text-[#1C2B4A] mb-1">Historial de exámenes</h2>
    <p className="text-sm font-ui text-[#5b5646] mb-5">Simuladores que has completado en esta sesión.</p>
    {history.length === 0 ? (
      <div className="text-center py-16 font-ui text-[#5b5646]">
        <HistoryIcon className="mx-auto mb-2 text-[#1C2B4A]/30" size={32} />
        <p>Todavía no has completado ningún simulador.</p>
      </div>
    ) : (
      <div className="space-y-3 font-ui">
        {history.map((h, i) => (
          <div key={i} className="bg-white border border-[#1C2B4A]/10 rounded-md p-4 flex items-center justify-between">
            <div>
              <p className="font-medium text-[#1C2B4A]">{SUBJECT_LABELS[h.materia] || h.materia}</p>
              <p className="text-xs text-[#5b5646]">{h.fecha} · {h.preguntas} preguntas · {Math.floor(h.elapsedSec / 60)} min {h.elapsedSec % 60}s</p>
            </div>
            <div className="text-right">
              <p className="font-serif-brand text-lg text-[#1C2B4A]">{h.porcentaje}%</p>
              <p className="text-xs text-[#5b5646]">{h.correctas}/{h.preguntas} correctas</p>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

/* ============================================================
   UNIVERSITY / SUBJECT PAGES
   ============================================================ */

const UniversityPage = ({ name, pdfs, onOpen, favorites, toggleFavorite }) => {
  const list = pdfs.filter(p => p.universidad === name);
  const subjects = [...new Set(list.map(p => p.materiaLabel))];
  const careers = [...new Set(list.map(p => p.carrera))];
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-1">
        <Building2 className="text-[#B8862E]" />
        <h2 className="font-serif-brand text-2xl text-[#1C2B4A]">{name}</h2>
      </div>
      <p className="text-sm font-ui text-[#5b5646] mb-5">{list.length} documentos disponibles en la biblioteca</p>
      <div className="flex flex-wrap gap-4 mb-6 font-ui text-sm">
        <div><span className="text-[#5b5646]">Materias: </span>{subjects.join(", ") || "—"}</div>
        <div><span className="text-[#5b5646]">Carreras: </span>{careers.join(", ") || "—"}</div>
      </div>
      <ResultsGrid pdfs={list} onOpen={onOpen} favorites={favorites} toggleFavorite={toggleFavorite} />
    </div>
  );
};

const SubjectPage = ({ subjectId, pdfs, onOpen, favorites, toggleFavorite }) => {
  const label = SUBJECT_LABELS[subjectId] || subjectId;
  const list = pdfs.filter(p => p.materia === subjectId);
  const popularQuestions = QUESTION_BANK.filter(q => q.materia === subjectId).slice(0, 3);
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-1">
        <BookOpen className="text-[#B8862E]" />
        <h2 className="font-serif-brand text-2xl text-[#1C2B4A]">{label}</h2>
      </div>
      <p className="text-sm font-ui text-[#5b5646] mb-6">{list.length} documentos en esta materia</p>
      <ResultsGrid pdfs={list} onOpen={onOpen} favorites={favorites} toggleFavorite={toggleFavorite} />
      {popularQuestions.length > 0 && (
        <div className="mt-10">
          <h3 className="font-serif-brand text-xl text-[#1C2B4A] mb-3">Preguntas populares de {label}</h3>
          <div className="space-y-4">
            {popularQuestions.map(q => <PracticeQuestion key={q.id} q={q} />)}
          </div>
        </div>
      )}
    </div>
  );
};

/* ============================================================
   ADMIN PANEL
   ============================================================ */

const AdminPanel = ({ pdfs, setPdfs }) => {
  const [tab, setTab] = useState("upload");
  const [form, setForm] = useState({
    titulo: "", universidad: UNIVERSITIES[0], carrera: "", materia: "biologia",
    anio: 2026, tipo: "Examen universitario", numeroPreguntas: 0, tieneRespuestas: false,
    dificultad: "Intermedia", descripcion: "",
  });
  const [fileName, setFileName] = useState("");
  const [extracted, setExtracted] = useState(null);

  const handleFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.type !== "application/pdf") { alert("Solo se aceptan archivos PDF."); return; }
    if (f.size > 20 * 1024 * 1024) { alert("El archivo excede el límite de 20 MB."); return; }
    setFileName(f.name);
    // Simulated extraction preview — real extraction needs a backend PDF-parsing service.
    setExtracted([
      { pregunta: "(vista previa) ¿Cuál es la capital de Francia?", opciones: ["Madrid", "París", "Roma", "Berlín"], correctaDetectada: 1 },
      { pregunta: "(vista previa) 2 + 2 =", opciones: ["3", "4", "5", "6"], correctaDetectada: 1 },
    ]);
  };

  const submitPdf = (e) => {
    e.preventDefault();
    if (!form.titulo || !fileName) { alert("Completa el título y adjunta un PDF."); return; }
    const materiaLabel = SUBJECT_LABELS[form.materia] || form.materia;
    setPdfs(list => [
      mkPdf({ ...form, materiaLabel, tags: [] }),
      ...list,
    ]);
    alert("Documento agregado al catálogo de esta sesión (marcado como DEMO).");
    setForm({ ...form, titulo: "", descripcion: "" });
    setFileName(""); setExtracted(null);
  };

  const removePdf = (id) => setPdfs(list => list.filter(p => p.id !== id));

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-1">
        <ShieldCheck className="text-[#B8862E]" />
        <h2 className="font-serif-brand text-2xl text-[#1C2B4A]">Panel de administrador</h2>
      </div>
      <p className="text-sm font-ui text-[#5b5646] mb-2">
        Acceso protegido en producción mediante autenticación y rol de administrador. En este prototipo, cualquier
        cambio se guarda solo en la memoria de la sesión actual.
      </p>
      <DemoBadge />

      <div className="flex gap-2 mt-6 mb-5 border-b border-[#1C2B4A]/10 font-ui text-sm">
        {[["upload", "Subir PDF"], ["manage", "Gestionar documentos"], ["taxonomy", "Categorías y catálogos"]].map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)} className={`px-3 py-2 border-b-2 ${tab === id ? "border-[#B8862E] text-[#1C2B4A] font-semibold" : "border-transparent text-[#5b5646]"}`}>
            {label}
          </button>
        ))}
      </div>

      {tab === "upload" && (
        <div className="grid lg:grid-cols-2 gap-6">
          <form onSubmit={submitPdf} className="bg-white border border-[#1C2B4A]/10 rounded-md p-5 font-ui space-y-3">
            <div>
              <label className="text-xs font-semibold text-[#1C2B4A]/60 block mb-1">Archivo PDF</label>
              <label className="flex items-center gap-2 border border-dashed border-[#1C2B4A]/25 rounded-md px-3 py-4 cursor-pointer text-sm text-[#5b5646]">
                <Upload size={16} />
                {fileName || "Seleccionar archivo (máx. 20 MB)"}
                <input type="file" accept="application/pdf" className="hidden" onChange={handleFile} />
              </label>
            </div>
            <div>
              <label className="text-xs font-semibold text-[#1C2B4A]/60 block mb-1">Título</label>
              <input value={form.titulo} onChange={e => setForm(f => ({ ...f, titulo: e.target.value }))} className="w-full border border-[#1C2B4A]/15 rounded-md px-2 py-2 text-sm" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-[#1C2B4A]/60 block mb-1">Universidad</label>
                <select value={form.universidad} onChange={e => setForm(f => ({ ...f, universidad: e.target.value }))} className="w-full border border-[#1C2B4A]/15 rounded-md px-2 py-2 text-sm">
                  {UNIVERSITIES.map(u => <option key={u}>{u}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-[#1C2B4A]/60 block mb-1">Carrera</label>
                <input value={form.carrera} onChange={e => setForm(f => ({ ...f, carrera: e.target.value }))} className="w-full border border-[#1C2B4A]/15 rounded-md px-2 py-2 text-sm" />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#1C2B4A]/60 block mb-1">Materia</label>
                <select value={form.materia} onChange={e => setForm(f => ({ ...f, materia: e.target.value }))} className="w-full border border-[#1C2B4A]/15 rounded-md px-2 py-2 text-sm">
                  {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-[#1C2B4A]/60 block mb-1">Año</label>
                <input type="number" value={form.anio} onChange={e => setForm(f => ({ ...f, anio: Number(e.target.value) }))} className="w-full border border-[#1C2B4A]/15 rounded-md px-2 py-2 text-sm" />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#1C2B4A]/60 block mb-1">N.º de preguntas</label>
                <input type="number" value={form.numeroPreguntas} onChange={e => setForm(f => ({ ...f, numeroPreguntas: Number(e.target.value) }))} className="w-full border border-[#1C2B4A]/15 rounded-md px-2 py-2 text-sm" />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#1C2B4A]/60 block mb-1">Dificultad</label>
                <select value={form.dificultad} onChange={e => setForm(f => ({ ...f, dificultad: e.target.value }))} className="w-full border border-[#1C2B4A]/15 rounded-md px-2 py-2 text-sm">
                  <option>Fácil</option><option>Intermedia</option><option>Difícil</option>
                </select>
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.tieneRespuestas} onChange={e => setForm(f => ({ ...f, tieneRespuestas: e.target.checked }))} />
              Este documento incluye clave de respuestas
            </label>
            <div>
              <label className="text-xs font-semibold text-[#1C2B4A]/60 block mb-1">Descripción</label>
              <textarea value={form.descripcion} onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))} rows={3} className="w-full border border-[#1C2B4A]/15 rounded-md px-2 py-2 text-sm" />
            </div>
            <Button variant="gold" type="submit" className="w-full">Publicar documento</Button>
          </form>

          <div className="bg-white border border-[#1C2B4A]/10 rounded-md p-5 font-ui">
            <p className="font-semibold text-[#1C2B4A] mb-2">Extracción automática (vista previa)</p>
            <p className="text-xs text-[#5b5646] mb-3">
              Requiere un servicio de análisis de PDF en el backend. Aquí se muestra un ejemplo de cómo se
              presentarían las preguntas detectadas para que el administrador las revise antes de publicarlas.
            </p>
            {!extracted ? (
              <p className="text-sm text-[#5b5646] italic">Sube un PDF para ver una vista previa de extracción.</p>
            ) : (
              <div className="space-y-3">
                {extracted.map((q, i) => (
                  <div key={i} className="border border-[#1C2B4A]/10 rounded-md p-3 text-sm">
                    <p className="font-medium text-[#1C2B4A]">{q.pregunta}</p>
                    <ul className="mt-1 space-y-0.5">
                      {q.opciones.map((o, j) => (
                        <li key={j} className={j === q.correctaDetectada ? "text-[#215347] font-medium" : "text-[#3d3a2e]"}>
                          {String.fromCharCode(65 + j)}) {o} {j === q.correctaDetectada && "← detectada como correcta"}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
                <Button variant="outline" className="w-full">Aprobar y guardar preguntas</Button>
              </div>
            )}
          </div>
        </div>
      )}

      {tab === "manage" && (
        <div className="bg-white border border-[#1C2B4A]/10 rounded-md overflow-hidden font-ui">
          <table className="w-full text-sm">
            <thead className="bg-[#1C2B4A]/5 text-[#1C2B4A]">
              <tr>
                <th className="text-left px-4 py-2">Título</th>
                <th className="text-left px-4 py-2">Universidad</th>
                <th className="text-left px-4 py-2">Materia</th>
                <th className="text-left px-4 py-2">Año</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {pdfs.map(p => (
                <tr key={p.id} className="border-t border-[#1C2B4A]/10">
                  <td className="px-4 py-2">{p.titulo}</td>
                  <td className="px-4 py-2 text-[#5b5646]">{p.universidad}</td>
                  <td className="px-4 py-2 text-[#5b5646]">{p.materiaLabel}</td>
                  <td className="px-4 py-2 text-[#5b5646]">{p.anio}</td>
                  <td className="px-4 py-2 flex gap-2 justify-end">
                    <button className="text-[#1C2B4A]/60 hover:text-[#1C2B4A]"><Pencil size={14} /></button>
                    <button onClick={() => removePdf(p.id)} className="text-[#B23A2F]/70 hover:text-[#B23A2F]"><Trash2 size={14} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "taxonomy" && (
        <div className="grid sm:grid-cols-3 gap-4 font-ui text-sm">
          <div className="bg-white border border-[#1C2B4A]/10 rounded-md p-4">
            <p className="font-semibold text-[#1C2B4A] mb-2">Universidades</p>
            {UNIVERSITIES.map(u => <p key={u} className="text-[#5b5646] py-0.5">{u}</p>)}
            <button className="text-[#B8862E] mt-2 font-medium">+ Agregar universidad</button>
          </div>
          <div className="bg-white border border-[#1C2B4A]/10 rounded-md p-4">
            <p className="font-semibold text-[#1C2B4A] mb-2">Materias</p>
            {CATEGORIES.slice(0, 6).map(c => <p key={c.id} className="text-[#5b5646] py-0.5">{c.label}</p>)}
            <button className="text-[#B8862E] mt-2 font-medium">+ Agregar materia</button>
          </div>
          <div className="bg-white border border-[#1C2B4A]/10 rounded-md p-4">
            <p className="font-semibold text-[#1C2B4A] mb-2">Carreras</p>
            {[...new Set(pdfs.map(p => p.carrera))].map(c => <p key={c} className="text-[#5b5646] py-0.5">{c}</p>)}
            <button className="text-[#B8862E] mt-2 font-medium">+ Agregar carrera</button>
          </div>
        </div>
      )}
    </div>
  );
};

/* ============================================================
   FOOTER
   ============================================================ */

const Footer = () => (
  <footer className="bg-[#1C2B4A] text-[#F3EFE6]/70 mt-16">
    <div className="max-w-6xl mx-auto px-4 py-8 font-ui text-sm flex flex-col sm:flex-row justify-between gap-4">
      <p>© 2026 Examoteca — Plataforma de preparación para la Escuela Médico Naval.</p>
      <p>Los documentos marcados como DEMO son de ejemplo; el banco de preguntas es contenido original de la plataforma, no reactivos oficiales de ningún examen real.</p>
    </div>
  </footer>
);

/* ============================================================
   ROOT APP
   ============================================================ */

export default function App() {
  const [view, setView] = useState("home");
  const [query, setQuery] = useState("");
  const [activeQuery, setActiveQuery] = useState("");
  const [selectedPdfId, setSelectedPdfId] = useState(null);
  const [selectedUniversity, setSelectedUniversity] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [pdfs, setPdfs] = useState(INITIAL_PDFS);
  const [favorites, setFavorites] = useState(new Set());
  const [history, setHistory] = useState([]);
  const [simulatorConfig, setSimulatorConfig] = useState(null);
  const [simulatorResult, setSimulatorResult] = useState(null);
  const [filters, setFilters] = useState({ universidad: "", carrera: "", anio: "", tipo: "", respuestas: "Todos", dificultad: "Todas" });

  const toggleFavorite = (id) => {
    setFavorites(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const openPdf = (id) => { setSelectedPdfId(id); setView("pdf"); window.scrollTo(0, 0); };
  const goResults = () => { setActiveQuery(query); setView("results"); };
  const navigate = (id) => {
    setView(id);
    window.scrollTo(0, 0);
  };

  const finishSimulator = (result) => {
    if (!result) { setView("simulatorSetup"); return; } // materia sin preguntas: regresar a configurar
    setSimulatorResult(result);
    const correct = result.questions.filter((q, i) => result.answers[i] === q.correcta).length;
    setHistory(h => [{
      materia: simulatorConfig.materia,
      preguntas: result.questions.length,
      correctas: correct,
      porcentaje: Math.round((correct / result.questions.length) * 100),
      elapsedSec: result.elapsedSec,
      fecha: new Date().toLocaleDateString("es-MX", { year: "numeric", month: "short", day: "numeric" }),
    }, ...h]);
    setView("simulatorResults");
  };

  const selectedPdf = pdfs.find(p => p.id === selectedPdfId);

  return (
    <div className="min-h-screen bg-[#F3EFE6] font-ui text-[#1C2B4A]">
      <Header query={query} setQuery={setQuery} onSearch={goResults} onNavigate={navigate} current={view} />

      {view === "home" && (
        <>
          <Hero query={query} setQuery={setQuery} onSearch={goResults} />
          <CategoryGrid onPick={(id) => { setSelectedSubject(id); setView("subject"); }} />
          <div className="max-w-6xl mx-auto px-4 pb-4 flex items-center justify-between">
            <h2 className="font-serif-brand text-2xl text-[#1C2B4A]">Documentos recientes</h2>
            <button onClick={() => { setActiveQuery(""); setView("results"); }} className="text-sm font-ui text-[#B8862E] font-medium flex items-center gap-1">
              Ver todos <ChevronRight size={16} />
            </button>
          </div>
          <div className="max-w-6xl mx-auto px-4 pb-14">
            <ResultsGrid pdfs={pdfs.slice(0, 6)} onOpen={openPdf} favorites={favorites} toggleFavorite={toggleFavorite} />
          </div>
          <div className="max-w-6xl mx-auto px-4 pb-16">
            <button
              onClick={() => { setSelectedUniversity(UNIVERSITIES[0]); setView("university"); }}
              className="w-full text-left bg-[#1C2B4A] text-[#F3EFE6] rounded-md p-6 flex items-center justify-between hover:bg-[#14213b] transition-colors"
            >
              <div>
                <p className="font-serif-brand text-xl">{UNIVERSITIES[0]}</p>
                <p className="font-ui text-sm text-[#F3EFE6]/70 mt-1">
                  Ver todo el material disponible para tu proceso de admisión
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="font-serif-brand text-2xl">{pdfs.length}</p>
                <p className="font-ui text-xs text-[#F3EFE6]/70">documentos</p>
              </div>
            </button>
          </div>
        </>
      )}

      {view === "results" && (
        <ResultsPage pdfs={pdfs} query={activeQuery} filters={filters} setFilters={setFilters} onOpen={openPdf} favorites={favorites} toggleFavorite={toggleFavorite} />
      )}

      {view === "pdf" && (
        <PdfDetailPage pdf={selectedPdf} onBack={() => setView("results")} favorites={favorites} toggleFavorite={toggleFavorite} />
      )}

      {view === "practice" && <PracticePage />}

      {view === "simulatorSetup" && (
        <SimulatorSetup onStart={(cfg) => { setSimulatorConfig(cfg); setView("simulatorRun"); }} />
      )}
      {view === "simulatorRun" && (
        <SimulatorRun config={simulatorConfig} onFinish={finishSimulator} />
      )}
      {view === "simulatorResults" && simulatorResult && (
        <SimulatorResults result={simulatorResult} onRestart={() => setView("simulatorSetup")} onExit={() => navigate("home")} />
      )}

      {view === "favorites" && (
        <FavoritesPage pdfs={pdfs} favorites={favorites} toggleFavorite={toggleFavorite} onOpen={openPdf} />
      )}
      {view === "history" && <HistoryPage history={history} />}

      {view === "university" && selectedUniversity && (
        <UniversityPage name={selectedUniversity} pdfs={pdfs} onOpen={openPdf} favorites={favorites} toggleFavorite={toggleFavorite} />
      )}
      {view === "subject" && selectedSubject && (
        <SubjectPage subjectId={selectedSubject} pdfs={pdfs} onOpen={openPdf} favorites={favorites} toggleFavorite={toggleFavorite} />
      )}

      {view === "admin" && <AdminPanel pdfs={pdfs} setPdfs={setPdfs} />}

      <Footer />
    </div>
  );
}
