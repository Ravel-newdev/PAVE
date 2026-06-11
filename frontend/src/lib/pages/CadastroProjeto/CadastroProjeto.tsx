import React, { useState, type ReactNode } from "react";

interface ProjectData {
  title: string;
  type: string;
  area: string;
  subArea: string;
  summary: string;
  banner: string;

  description: string;
  startDate: string;
  endDate: string;
  hours: string;
  slots: string;

  modality: string;
  location: string;

  questions: string[];
  docs: string[];
  stages: string[];

  inscriptionStart: string;
  inscriptionEnd: string;

  requirements: string[];
  benefits: string[];

  scholarshipValue: string;
}

const COLORS = {
  primary: "#287999",
  primaryDark: "#1a5f7a",
  primaryLight: "#e8f4f8",
  accent: "#4CAF82",
  bg: "#F4F7F4",
  white: "#ffffff",
  border: "#DDE5DD",
  text: "#1a2e1a",
  textMuted: "#6b7f6b",
  textLight: "#9aab9a",
  error: "#e05252",
  warning: "#f0a500",
  success: "#4CAF82",
  cardShadow: "0 2px 16px rgba(40,121,153,0.08)",
};

const steps = [
  { id: 1, label: "Informações Gerais", icon: "" },
  { id: 2, label: "Detalhes do Projeto", icon: "" },
  { id: 3, label: "Processo Seletivo", icon: "" },
  { id: 4, label: "Requisitos e Benefícios", icon: "" },
  { id: 5, label: "Revisão", icon: "" },
];

type Tip = {
  icon: string;
  title: string;
  desc: string;
}

const tipsByStep: Record<number, Tip[]> = {
  1: [
    { icon: "", title: "Seja claro e objetivo", desc: "Escolha um título que descreva bem o projeto." },
    { icon: "", title: "Adicione uma imagem", desc: "Projetos com banner recebem muito mais inscrições." },
    { icon: "", title: "Resumo impactante", desc: "200 caracteres para convencer o estudante." },
  ],
  2: [
    { icon: "", title: "Descreva o impacto", desc: "Explique como o estudante vai crescer no projeto." },
    { icon: "", title: "Datas realistas", desc: "Defina prazos que caibam no calendário acadêmico." },
    { icon: "", title: "Informe a modalidade", desc: "Presencial, remoto ou híbrido — seja direto." },
  ],
  3: [
    { icon: "", title: "Perguntas relevantes", desc: "Faça perguntas que realmente ajudem na seleção." },
    { icon: "", title: "Documentos essenciais", desc: "Peça apenas o que vai realmente usar." },
    { icon: "", title: "Prazo claro", desc: "Defina um prazo de inscrição com antecedência." },
  ],
  4: [
    { icon: "", title: "Requisitos realistas", desc: "Liste apenas o necessário para participar." },
    { icon: "", title: "Destaque os benefícios", desc: "Certificado e horas complementares atraem muito." },
    { icon: "", title: "Seja transparente", desc: "Candidatos bem informados se engajam mais." },
  ],
  5: [
    { icon: "", title: "Revise tudo", desc: "Confira cada informação antes de publicar." },
    { icon: "", title: "Preview do card", desc: "Veja como seu projeto aparece no catálogo." },
    { icon: "", title: "Pronto para publicar!", desc: "Seu projeto ficará visível para os estudantes." },
  ],
};

const areaOptions = ["Tecnologia", "Saúde", "Educação", "Meio Ambiente", "Cultura", "Esporte", "Direito", "Engenharia", "Comunicação"];
const subAreaMap: Record<string, string[]> = {
  Tecnologia: ["Desenvolvimento de Software", "Inteligência Artificial", "Redes", "Segurança"],
  Saúde: ["Medicina", "Enfermagem", "Nutrição", "Fisioterapia"],
  Educação: ["Pedagogia", "EAD", "Inclusão", "Alfabetização"],
  "Meio Ambiente": ["Sustentabilidade", "Reciclagem", "Fauna e Flora", "Energia"],
  Cultura: ["Arte", "Música", "Teatro", "Literatura"],
  Esporte: ["Futebol", "Atletismo", "Natação", "Esportes Coletivos"],
  Direito: ["Direito Civil", "Ambiental", "Trabalhista", "Digital"],
  Engenharia: ["Civil", "Elétrica", "Mecânica", "Química"],
  Comunicação: ["Jornalismo", "Publicidade", "Mídias Sociais", "Fotografia"],
};

function NavBar({ currentStep }: { currentStep: number }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navItems = [
    { icon: "", label: "Início" },
    { icon: "", label: "Projetos", active: true },
    { icon: "", label: "Inscrições" },
    { icon: "", label: "Kanban" },
  ];

  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 100,
      background: COLORS.white,
      borderBottom: `1px solid ${COLORS.border}`,
      boxShadow: "0 1px 8px rgba(40,121,153,0.07)",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", height: 60 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.accent})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🌱</div>
          <div>
            <span style={{ fontFamily: "'Georgia', serif", fontWeight: 700, fontSize: 18, color: COLORS.primary, letterSpacing: -0.5 }}>PAVE</span>
            <div style={{ fontSize: 9, color: COLORS.textMuted, letterSpacing: 0.3, lineHeight: 1, marginTop: -1 }}>Voluntariado e Extensão</div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 4 }} className="nav-desktop">
          {navItems.map(item => (
            <button key={item.label} style={{
              background: item.active ? COLORS.primaryLight : "transparent",
              border: "none", borderRadius: 8, padding: "6px 14px",
              display: "flex", alignItems: "center", gap: 6,
              color: item.active ? COLORS.primary : COLORS.textMuted,
              fontWeight: item.active ? 600 : 400,
              fontSize: 14, cursor: "pointer",
            }}>
              {item.icon} {item.label}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ position: "relative" }}>
            <button style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: 20, color: COLORS.textMuted }}>🔔</button>
            <span style={{ position: "absolute", top: 0, right: 0, background: COLORS.error, color: "#fff", borderRadius: 999, fontSize: 9, width: 14, height: 14, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>2</span>
          </div>
          <div style={{ width: 34, height: 34, borderRadius: "50%", background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.accent})`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>PC</div>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} style={{ display: "none", background: "transparent", border: "none", fontSize: 22, cursor: "pointer", color: COLORS.textMuted }} className="mobile-menu-btn">☰</button>
        </div>
      </div>
      <style>{`
        @media (max-width: 640px) {
          .nav-desktop { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </nav>
  );
}

function StepIndicator({
  currentStep,
  setStep,
}: {
  currentStep: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
}) {
  return (
    <div style={{ overflowX: "auto", paddingBottom: 4 }}>
      <div style={{ display: "flex", alignItems: "center", minWidth: 600, gap: 0 }}>
        {steps.map((step, i) => {
          const done = step.id < currentStep;
          const active = step.id === currentStep;
          return (
            <div key={step.id} style={{ display: "flex", alignItems: "center", flex: 1 }}>
              <button
                onClick={() => done && setStep(step.id)}
                style={{
                  display: "flex", alignItems: "center", gap: 8,
                  background: "none", border: "none", cursor: done ? "pointer" : "default",
                  padding: "8px 0",
                }}
              >
                <div style={{
                  width: 32, height: 32, borderRadius: "50%",
                  background: active ? COLORS.primary : done ? COLORS.accent : COLORS.border,
                  color: active || done ? "#fff" : COLORS.textMuted,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: done ? 14 : 13, fontWeight: 700,
                  transition: "all 0.3s",
                  flexShrink: 0,
                }}>
                  {done ? "✓" : step.id}
                </div>
                <span style={{ fontSize: 13, fontWeight: active ? 600 : 400, color: active ? COLORS.primary : done ? COLORS.accent : COLORS.textMuted, whiteSpace: "nowrap" }}>
                  {step.label}
                </span>
              </button>
              {i < steps.length - 1 && (
                <div style={{ flex: 1, height: 2, background: done ? COLORS.accent : COLORS.border, margin: "0 8px", transition: "all 0.3s" }} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ProgressBar({ currentStep }: { currentStep: number }) {
  const pct = Math.round(((currentStep - 1) / (steps.length - 1)) * 100);
  return (
    <div style={{ background: COLORS.white, borderRadius: 12, padding: "12px 16px", boxShadow: COLORS.cardShadow }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: COLORS.text }}>Progresso do cadastro</span>
        <span style={{ fontSize: 12, color: COLORS.textMuted }}>Etapa {currentStep} de {steps.length}</span>
      </div>
      <div style={{ background: COLORS.border, borderRadius: 999, height: 8, overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.accent})`, borderRadius: 999, transition: "width 0.5s ease" }} />
      </div>
      <div style={{ textAlign: "right", fontSize: 11, color: COLORS.primary, fontWeight: 600, marginTop: 4 }}>{pct}%</div>
    </div>
  );
}

function TipsPanel({ currentStep }: { currentStep: number }) {
  return (
    <div style={{ background: COLORS.white, borderRadius: 12, padding: "16px", boxShadow: COLORS.cardShadow }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.text, marginBottom: 12 }}>💡 Dicas para um bom cadastro</div>
      {(tipsByStep[currentStep] || []).map((tip,i) => (
        <div key={i} style={{ display: "flex", gap: 10, marginBottom: 12 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: COLORS.primaryLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>{tip.icon}</div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: COLORS.text }}>{tip.title}</div>
            <div style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 2, lineHeight: 1.4 }}>{tip.desc}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function PreviewCard({ data }: {data: ProjectData}) {
  return (
    <div style={{ background: COLORS.white, borderRadius: 12, padding: "16px", boxShadow: COLORS.cardShadow }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.text, marginBottom: 12 }}>🌟 Preview do card</div>
      <div style={{ borderRadius: 12, overflow: "hidden", border: `1px solid ${COLORS.border}` }}>
        <div style={{ height: 80, background: data.banner ? `url(${data.banner}) center/cover` : `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.accent})`, display: "flex", alignItems: "flex-end", padding: 10 }}>
          {data.type && <span style={{ background: "rgba(255,255,255,0.2)", backdropFilter: "blur(4px)", color: "#fff", fontSize: 10, padding: "2px 8px", borderRadius: 999, fontWeight: 600 }}>{data.type}</span>}
        </div>
        <div style={{ padding: "10px 12px" }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.text, marginBottom: 4 }}>{data.title || "Título do projeto..."}</div>
          <div style={{ fontSize: 11, color: COLORS.textMuted, lineHeight: 1.4 }}>{data.summary?.slice(0, 80) || "Resumo do projeto aparecerá aqui..."}{data.summary?.length > 80 ? "..." : ""}</div>
          {data.area && <div style={{ marginTop: 8, display: "flex", gap: 4 }}>
            <span style={{ background: COLORS.primaryLight, color: COLORS.primary, fontSize: 10, padding: "2px 8px", borderRadius: 999 }}>{data.area}</span>
            {data.modality && <span style={{ background: "#f0f4f0", color: COLORS.textMuted, fontSize: 10, padding: "2px 8px", borderRadius: 999 }}>{data.modality}</span>}
          </div>}
        </div>
      </div>
    </div>
  );
}

function InputField({ 
  label,
  required, 
  placeholder, 
  value, 
  onChange, 
  type = "text", 
  maxLength, 
  hint 
}: {
  label: string;
  required?: boolean;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  maxLength?: number;
  hint?: string;
}) {
  const [count, setCount] = useState(value?.length || 0);
  return (
    <div style={{ marginBottom: 20 }}>
      <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: COLORS.text, marginBottom: 6 }}>
        {label} {required && <span style={{ color: COLORS.error }}>*</span>}
      </label>
      {hint && <div style={{ fontSize: 11, color: COLORS.textMuted, marginBottom: 6 }}>{hint}</div>}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        maxLength={maxLength}
        onChange={e => { onChange(e.target.value); setCount(e.target.value.length); }}
        style={{
          width: "100%", padding: "10px 14px", border: `1.5px solid ${COLORS.border}`,
          borderRadius: 10, fontSize: 14, color: COLORS.text, background: COLORS.white,
          outline: "none", boxSizing: "border-box", fontFamily: "inherit",
          transition: "border-color 0.2s",
        }}
        onFocus={e => e.target.style.borderColor = COLORS.primary}
        onBlur={e => e.target.style.borderColor = COLORS.border}
      />
      {maxLength && <div style={{ textAlign: "right", fontSize: 11, color: COLORS.textMuted, marginTop: 4 }}>{count}/{maxLength}</div>}
    </div>
  );
}

function SelectField({ 
  label, 
  required, 
  options, 
  value, 
  onChange, 
  placeholder 
}: {
  label: string;
  required?: boolean;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div style={{ marginBottom: 20 }}>
      <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: COLORS.text, marginBottom: 6 }}>
        {label} {required && <span style={{ color: COLORS.error }}>*</span>}
      </label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          width: "100%", padding: "10px 14px", border: `1.5px solid ${COLORS.border}`,
          borderRadius: 10, fontSize: 14, color: value ? COLORS.text : COLORS.textLight,
          background: COLORS.white, outline: "none", boxSizing: "border-box",
          fontFamily: "inherit", appearance: "none", cursor: "pointer",
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236b7f6b' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
          backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center",
        }}
        onFocus={e => e.target.style.borderColor = COLORS.primary}
        onBlur={e => e.target.style.borderColor = COLORS.border}
      >
        <option value="">{placeholder || "Selecione..."}</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

function TextAreaField({ 
  label, 
  required, 
  placeholder, 
  value, 
  onChange, 
  maxLength, 
  hint, 
  rows = 4 
}: {
  label: string;
  required?: boolean;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
  hint?: string;
  rows?: number;
}) {
  const [count, setCount] = useState(value?.length || 0);
  return (
    <div style={{ marginBottom: 20 }}>
      <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: COLORS.text, marginBottom: 6 }}>
        {label} {required && <span style={{ color: COLORS.error }}>*</span>}
      </label>
      {hint && <div style={{ fontSize: 11, color: COLORS.textMuted, marginBottom: 6 }}>{hint}</div>}
      <textarea
        placeholder={placeholder}
        value={value}
        maxLength={maxLength}
        rows={rows}
        onChange={e => { onChange(e.target.value); setCount(e.target.value.length); }}
        style={{
          width: "100%", padding: "10px 14px", border: `1.5px solid ${COLORS.border}`,
          borderRadius: 10, fontSize: 14, color: COLORS.text, background: COLORS.white,
          outline: "none", boxSizing: "border-box", fontFamily: "inherit", resize: "vertical",
        }}
        onFocus={e => e.target.style.borderColor = COLORS.primary}
        onBlur={e => e.target.style.borderColor = COLORS.border}
      />
      {maxLength && <div style={{ textAlign: "right", fontSize: 11, color: COLORS.textMuted, marginTop: 4 }}>{count}/{maxLength}</div>}
    </div>
  );
}

function Card({ 
   children,
   title,
   icon 
}: {
  children: ReactNode;
  title?: string;
  icon?: string;
}) {
  return (
    <div style={{ background: COLORS.white, borderRadius: 16, padding: "24px", boxShadow: COLORS.cardShadow, marginBottom: 20 }}>
      {title && <div style={{ fontSize: 16, fontWeight: 700, color: COLORS.text, marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
        {icon && <span>{icon}</span>} {title}
      </div>}
      {children}
    </div>
  );
}

function Step1({ 
  data, 
  setData
}: {
  data: ProjectData,
  setData: React.Dispatch<React.SetStateAction<ProjectData>>;
}) {
  return (
    <>
      <Card title="Informações Gerais" icon="📋">
        <InputField label="Título do projeto" required placeholder="Ex.: Sustentabilidade na Comunidade" value={data.title} onChange={v => setData({ ...data, title: v })} maxLength={100} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <SelectField label="Tipo de oportunidade" required options={["Voluntariado", "Bolsa", "Extensão", "Pesquisa"]} value={data.type} onChange={v => setData({ ...data, type: v })} />
          <SelectField label="Área do projeto" required options={areaOptions} value={data.area} onChange={v => setData({ ...data, area: v, subArea: "" })} />
        </div>
        <SelectField label="Subárea" options={subAreaMap[data.area] || []} value={data.subArea} onChange={v => setData({ ...data, subArea: v })} placeholder="Selecione a subárea (opcional)" />
        <TextAreaField label="Resumo do projeto" required placeholder="Descreva brevemente o objetivo e impacto do projeto..." value={data.summary} onChange={v => setData({ ...data, summary: v })} maxLength={200} rows={3} hint="Será exibido no catálogo de projetos. Seja conciso e impactante." />
      </Card>
      <Card title="Imagem / Banner do Projeto" icon="🖼️">
        <div style={{ border: `2px dashed ${COLORS.border}`, borderRadius: 12, padding: 32, textAlign: "center", background: COLORS.bg, cursor: "pointer" }}
          onClick={() => document.getElementById("banner-upload")?.click()}>
          {data.banner
            ? <img src={data.banner} alt="Banner" style={{ maxHeight: 160, borderRadius: 8, objectFit: "cover" }} />
            : <>
              <div style={{ fontSize: 36, marginBottom: 8 }}>📸</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.textMuted }}>Clique para fazer upload</div>
              <div style={{ fontSize: 12, color: COLORS.textLight, marginTop: 4 }}>PNG, JPG ou WEBP • Recomendado: 1200x400px</div>
            </>}
          <input id="banner-upload" type="file" accept="image/*" style={{ display: "none" }} onChange={e => {
            const file = e.target.files?.[0];
            if (file) { const url = URL.createObjectURL(file); setData({ ...data, banner: url }); }
          }} />
        </div>
      </Card>
    </>
  );
}

function Step2({ 
  data,
  setData 
}: {
  data: ProjectData;
  setData: React.Dispatch<React.SetStateAction<ProjectData>>;
}) {
  return (
    <>
      <Card title="Descrição Completa" icon="📖">
        <div style={{ fontSize: 12, color: COLORS.textMuted, marginBottom: 8 }}>Explique o projeto, seus objetivos, público atendido e impacto esperado.</div>
        <div style={{ border: `1.5px solid ${COLORS.border}`, borderRadius: 10, overflow: "hidden" }}>
          <div style={{ background: COLORS.bg, padding: "8px 12px", display: "flex", gap: 8, borderBottom: `1px solid ${COLORS.border}` }}>
            {["B", "I", "U", "• Lista", "1. Lista"].map(b => (
              <button key={b} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 12, color: COLORS.textMuted, padding: "2px 6px", borderRadius: 4 }}>{b}</button>
            ))}
          </div>
          <textarea
            placeholder="Descreva o projeto com detalhes — objetivo, metodologia, público-alvo, impacto esperado..."
            value={data.description}
            rows={8}
            maxLength={3000}
            onChange={e => setData({ ...data, description: e.target.value })}
            style={{ width: "100%", padding: "12px 14px", border: "none", fontSize: 14, color: COLORS.text, background: COLORS.white, outline: "none", boxSizing: "border-box", fontFamily: "inherit", resize: "vertical" }}
          />
          <div style={{ textAlign: "right", padding: "4px 12px", fontSize: 11, color: COLORS.textMuted, borderTop: `1px solid ${COLORS.border}` }}>{data.description?.length || 0}/3000</div>
        </div>
      </Card>
      <Card title="Período e Logística" icon="📅">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <InputField label="Data de início" required type="date" value={data.startDate} onChange={v => setData({ ...data, startDate: v })} />
          <InputField label="Data de fim" required type="date" value={data.endDate} onChange={v => setData({ ...data, endDate: v })} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <InputField label="Carga horária semanal" required placeholder="Ex.: 12 horas" value={data.hours} onChange={v => setData({ ...data, hours: v })} />
          <InputField label="Número de vagas" required placeholder="Ex.: 15" type="number" value={data.slots} onChange={v => setData({ ...data, slots: v })} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <SelectField label="Modalidade" required options={["Presencial", "Remoto", "Híbrido"]} value={data.modality} onChange={v => setData({ ...data, modality: v })} />
          <InputField label="Local / Campus" placeholder="Ex.: Campus do Pici" value={data.location} onChange={v => setData({ ...data, location: v })} />
        </div>
      </Card>
    </>
  );
}

function Step3({
  data, 
  setData 
}: {
  data: ProjectData;
  setData: React.Dispatch<React.SetStateAction<ProjectData>>;
}) {
  const [newQuestion, setNewQuestion] = useState("");

  const addQuestion = () => {
    if (newQuestion.trim()) {
      setData({ ...data, questions: [...(data.questions || []), newQuestion.trim()] });
      setNewQuestion("");
    }
  };

  return (
    <>
      <Card title="Formulário Personalizado" icon="❓">
        <div style={{ fontSize: 12, color: COLORS.textMuted, marginBottom: 16 }}>Adicione perguntas que serão respondidas pelos candidatos ao se inscrever.</div>
        {(data.questions || []).map((q, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, background: COLORS.bg, borderRadius: 8, padding: "10px 14px", marginBottom: 8 }}>
            <span style={{ fontSize: 13, flex: 1, color: COLORS.text }}>❓ {q}</span>
            <button onClick={() => setData({ ...data, questions: data.questions.filter((_, j) => j !== i) })} style={{ background: "none", border: "none", cursor: "pointer", color: COLORS.error, fontSize: 16 }}>✕</button>
          </div>
        ))}
        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          <input
            placeholder='Ex.: "Por que deseja participar deste projeto?"'
            value={newQuestion}
            onChange={e => setNewQuestion(e.target.value)}
            onKeyDown={e => e.key === "Enter" && addQuestion()}
            style={{ flex: 1, padding: "10px 14px", border: `1.5px solid ${COLORS.border}`, borderRadius: 10, fontSize: 13, fontFamily: "inherit", outline: "none" }}
            onFocus={e => e.target.style.borderColor = COLORS.primary}
            onBlur={e => e.target.style.borderColor = COLORS.border}
          />
          <button onClick={addQuestion} style={{ padding: "10px 16px", background: COLORS.primary, color: "#fff", border: "none", borderRadius: 10, cursor: "pointer", fontWeight: 600, fontSize: 13 }}>+</button>
        </div>
      </Card>
      <Card title="Documentos Exigidos" icon="📎">
        {["Currículo", "Histórico Escolar", "Portfólio", "Carta de Motivação"].map(doc => (
          <label key={doc} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, cursor: "pointer" }}>
            <input type="checkbox" checked={(data.docs || []).includes(doc)} onChange={e => {
              const docs = data.docs || [];
              setData({ ...data, docs: e.target.checked ? [...docs, doc] : docs.filter(d => d !== doc) });
            }} style={{ width: 16, height: 16, accentColor: COLORS.primary }} />
            <span style={{ fontSize: 13, color: COLORS.text }}>{doc}</span>
          </label>
        ))}
      </Card>
      <Card title="Etapas da Seleção" icon="🗂️">
        {["Análise de currículo", "Entrevista", "Dinâmica de grupo", "Prova prática"].map(stage => (
          <label key={stage} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, cursor: "pointer" }}>
            <input type="checkbox" checked={(data.stages || []).includes(stage)} onChange={e => {
              const stages = data.stages || [];
              setData({ ...data, stages: e.target.checked ? [...stages, stage] : stages.filter(s => s !== stage) });
            }} style={{ width: 16, height: 16, accentColor: COLORS.primary }} />
            <span style={{ fontSize: 13, color: COLORS.text }}>{stage}</span>
          </label>
        ))}
      </Card>
      <Card title="Prazo de Inscrição" icon="📅">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <InputField label="Abertura das inscrições" required type="date" value={data.inscriptionStart} onChange={v => setData({ ...data, inscriptionStart: v })} />
          <InputField label="Encerramento das inscrições" required type="date" value={data.inscriptionEnd} onChange={v => setData({ ...data, inscriptionEnd: v })} />
        </div>
      </Card>
    </>
  );
}

function Step4({ 
  data, 
  setData 
}: {
  data: ProjectData;
  setData: React.Dispatch<React.SetStateAction<ProjectData>>;
}) {
  const [newReq, setNewReq] = useState("");
  return (
    <>
      <Card title="Requisitos para Participação" icon="✔️">
        <div style={{ fontSize: 12, color: COLORS.textMuted, marginBottom: 12 }}>Liste apenas requisitos realmente necessários para o projeto.</div>
        {(data.requirements || []).map((r, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, background: COLORS.bg, borderRadius: 8, padding: "10px 14px", marginBottom: 8 }}>
            <span style={{ fontSize: 13, flex: 1, color: COLORS.text }}>✓ {r}</span>
            <button onClick={() => setData({ ...data, requirements: data.requirements.filter((_, j) => j !== i) })} style={{ background: "none", border: "none", cursor: "pointer", color: COLORS.error, fontSize: 16 }}>✕</button>
          </div>
        ))}
        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          <input placeholder="Ex.: Boa comunicação, interesse em tecnologia..." value={newReq} onChange={e => setNewReq(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && newReq.trim()) { setData({ ...data, requirements: [...(data.requirements || []), newReq.trim()] }); setNewReq(""); } }}
            style={{ flex: 1, padding: "10px 14px", border: `1.5px solid ${COLORS.border}`, borderRadius: 10, fontSize: 13, fontFamily: "inherit", outline: "none" }}
            onFocus={e => e.target.style.borderColor = COLORS.primary}
            onBlur={e => e.target.style.borderColor = COLORS.border}
          />
          <button onClick={() => { if (newReq.trim()) { setData({ ...data, requirements: [...(data.requirements || []), newReq.trim()] }); setNewReq(""); } }}
            style={{ padding: "10px 16px", background: COLORS.primary, color: "#fff", border: "none", borderRadius: 10, cursor: "pointer", fontWeight: 600, fontSize: 13 }}>+</button>
        </div>
      </Card>
      <Card title="Benefícios para Participantes" icon="🎁">
        {["Certificado de participação", "Bolsa financeira", "Horas complementares", "Mentoria com professor", "Publicação de artigo", "Experiência prática"].map(benefit => (
          <label key={benefit} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, cursor: "pointer" }}>
            <input type="checkbox" checked={(data.benefits || []).includes(benefit)} onChange={e => {
              const benefits = data.benefits || [];
              setData({ ...data, benefits: e.target.checked ? [...benefits, benefit] : benefits.filter(b => b !== benefit) });
            }} style={{ width: 16, height: 16, accentColor: COLORS.primary }} />
            <span style={{ fontSize: 13, color: COLORS.text }}>{benefit}</span>
          </label>
        ))}
        {data.benefits?.includes("Bolsa financeira") && (
          <InputField label="Valor da bolsa" placeholder="Ex.: R$ 500,00 / mês" value={data.scholarshipValue} onChange={v => setData({ ...data, scholarshipValue: v })} />
        )}
      </Card>
    </>
  );
}

function Step5({ data}: {
  data: ProjectData;
}) {
  const fields = [
    { label: "Título", value: data.title },
    { label: "Tipo", value: data.type },
    { label: "Área", value: data.area + (data.subArea ? ` / ${data.subArea}` : "") },
    { label: "Modalidade", value: data.modality },
    { label: "Vagas", value: data.slots },
    { label: "Carga horária", value: data.hours },
    { label: "Período", value: data.startDate && data.endDate ? `${data.startDate} → ${data.endDate}` : null },
    { label: "Inscrições", value: data.inscriptionStart && data.inscriptionEnd ? `${data.inscriptionStart} → ${data.inscriptionEnd}` : null },
  ];

  return (
    <>
      <Card title="Resumo do Projeto" icon="📋">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {fields.filter(f => f.value).map(f => (
            <div key={f.label} style={{ background: COLORS.bg, borderRadius: 8, padding: "10px 12px" }}>
              <div style={{ fontSize: 11, color: COLORS.textMuted, marginBottom: 2 }}>{f.label}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.text }}>{f.value}</div>
            </div>
          ))}
        </div>
        {data.summary && (
          <div style={{ marginTop: 16, background: COLORS.bg, borderRadius: 8, padding: "12px 14px" }}>
            <div style={{ fontSize: 11, color: COLORS.textMuted, marginBottom: 4 }}>Resumo</div>
            <div style={{ fontSize: 13, color: COLORS.text, lineHeight: 1.5 }}>{data.summary}</div>
          </div>
        )}
      </Card>

      <Card title="Preview do Card do Catálogo" icon="🌟">
        <div style={{ maxWidth: 320, borderRadius: 14, overflow: "hidden", border: `1px solid ${COLORS.border}`, boxShadow: "0 4px 20px rgba(40,121,153,0.1)" }}>
          <div style={{ height: 120, background: data.banner ? `url(${data.banner}) center/cover` : `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.accent})`, display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: 12 }}>
            {data.type && <span style={{ display: "inline-block", background: "rgba(255,255,255,0.2)", backdropFilter: "blur(4px)", color: "#fff", fontSize: 11, padding: "3px 10px", borderRadius: 999, fontWeight: 600, width: "fit-content" }}>{data.type}</span>}
          </div>
          <div style={{ padding: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.text, marginBottom: 6 }}>{data.title || "Título do projeto"}</div>
            <div style={{ fontSize: 12, color: COLORS.textMuted, lineHeight: 1.5, marginBottom: 10 }}>{data.summary?.slice(0, 80) || "Resumo do projeto..."}</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {data.area && <span style={{ background: COLORS.primaryLight, color: COLORS.primary, fontSize: 11, padding: "3px 10px", borderRadius: 999 }}>{data.area}</span>}
              {data.modality && <span style={{ background: "#f0f4f0", color: COLORS.textMuted, fontSize: 11, padding: "3px 10px", borderRadius: 999 }}>{data.modality}</span>}
              {data.slots && <span style={{ background: "#f0f4f0", color: COLORS.textMuted, fontSize: 11, padding: "3px 10px", borderRadius: 999 }}>{data.slots} vagas</span>}
            </div>
            {(data.benefits || []).length > 0 && (
              <div style={{ marginTop: 10, display: "flex", gap: 4, flexWrap: "wrap" }}>
                {data.benefits.includes("Certificado de participação") && <span style={{ fontSize: 10, color: COLORS.success }}>✓ Certificado</span>}
                {data.benefits.includes("Bolsa financeira") && <span style={{ fontSize: 10, color: COLORS.warning }}>✓ Bolsa</span>}
                {data.benefits.includes("Horas complementares") && <span style={{ fontSize: 10, color: COLORS.primary }}>✓ H. Complementares</span>}
              </div>
            )}
          </div>
        </div>
      </Card>

      <div style={{ background: `linear-gradient(135deg, ${COLORS.primaryLight}, #e8f8f0)`, borderRadius: 16, padding: 24, textAlign: "center" }}>
        <div style={{ fontSize: 32, marginBottom: 8 }}>🚀</div>
        <div style={{ fontSize: 16, fontWeight: 700, color: COLORS.text, marginBottom: 4 }}>Tudo pronto para publicar!</div>
        <div style={{ fontSize: 13, color: COLORS.textMuted }}>Seu projeto ficará visível para todos os estudantes da plataforma.</div>
      </div>
    </>
  );
}

export default function CadastroProjeto() {
  const [step, setStep] = useState(1);
  const [saved, setSaved] = useState(false);
  const [published, setPublished] = useState(false);
  const [data, setData] = useState<ProjectData>({
    title: "", type: "", area: "", subArea: "", summary: "", banner: "",
    description: "", startDate: "", endDate: "", hours: "", slots: "",
    modality: "", location: "", questions: [], docs: [], stages: [],
    inscriptionStart: "", inscriptionEnd: "",
    requirements: [], benefits: [], scholarshipValue: "",
  });

  const handleSaveDraft = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };
  const handlePublish = () => setPublished(true);

  if (published) {
    return (
      <div style={{ minHeight: "100vh", background: COLORS.bg, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", padding: 24 }}>
        <div style={{ background: COLORS.white, borderRadius: 24, padding: 48, textAlign: "center", boxShadow: "0 8px 40px rgba(40,121,153,0.12)", maxWidth: 480, width: "100%" }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: COLORS.text, marginBottom: 8 }}>Projeto publicado!</div>
          <div style={{ fontSize: 14, color: COLORS.textMuted, marginBottom: 24, lineHeight: 1.6 }}>"{data.title || "Seu projeto"}" já está visível no catálogo para todos os estudantes.</div>
          <button onClick={() => { setPublished(false); setStep(1); setData({ title: "", type: "", area: "", subArea: "", summary: "", banner: "", description: "", startDate: "", endDate: "", hours: "", slots: "", modality: "", location: "", questions: [], docs: [], stages: [], inscriptionStart: "", inscriptionEnd: "", requirements: [], benefits: [], scholarshipValue: "" }); }}
            style={{ padding: "12px 28px", background: COLORS.primary, color: "#fff", border: "none", borderRadius: 12, cursor: "pointer", fontWeight: 600, fontSize: 15 }}>
            Criar outro projeto
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: COLORS.bg, fontFamily: "'Lato', 'Segoe UI', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lato:wght@400;600;700&display=swap');
        * { box-sizing: border-box; }
        @media (max-width: 900px) {
          .layout-main { flex-direction: column !important; }
          .sidebar { width: 100% !important; }
          .two-col { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 640px) {
          .step-indicator { display: none !important; }
          .step-mobile { display: flex !important; }
        }
        .step-mobile { display: none; }
      `}</style>

      <NavBar currentStep={step} />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 16px" }}>
        <div style={{ marginBottom: 8 }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: COLORS.text, margin: 0 }}>Cadastrar novo projeto</h1>
          <p style={{ fontSize: 13, color: COLORS.textMuted, margin: "4px 0 0" }}>Campos marcados com <span style={{ color: COLORS.error }}>*</span> são obrigatórios.</p>
        </div>

        <div style={{ background: COLORS.white, borderRadius: 16, padding: "20px 24px", boxShadow: COLORS.cardShadow, marginBottom: 24 }} className="step-indicator">
          <StepIndicator currentStep={step} setStep={setStep} />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12, background: COLORS.white, borderRadius: 16, padding: "14px 20px", boxShadow: COLORS.cardShadow, marginBottom: 24 }} className="step-mobile">
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: COLORS.primary, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>{step}</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.text }}>{steps[step - 1].label}</div>
            <div style={{ fontSize: 11, color: COLORS.textMuted }}>Etapa {step} de {steps.length}</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }} className="layout-main">
          <div style={{ flex: 1, minWidth: 0 }}>
            {step === 1 && <Step1 data={data} setData={setData} />}
            {step === 2 && <Step2 data={data} setData={setData} />}
            {step === 3 && <Step3 data={data} setData={setData} />}
            {step === 4 && <Step4 data={data} setData={setData} />}
            {step === 5 && <Step5 data={data} />}

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
              <button onClick={() => step > 1 ? setStep(step - 1) : null} style={{
                padding: "11px 24px", background: "transparent", border: `1.5px solid ${COLORS.border}`,
                borderRadius: 10, cursor: step > 1 ? "pointer" : "not-allowed", color: step > 1 ? COLORS.text : COLORS.textLight, fontWeight: 600, fontSize: 14,
              }}>← Voltar</button>

              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={handleSaveDraft} style={{
                  padding: "11px 20px", background: "transparent", border: `1.5px solid ${COLORS.border}`,
                  borderRadius: 10, cursor: "pointer", color: COLORS.textMuted, fontWeight: 600, fontSize: 13,
                  display: "flex", alignItems: "center", gap: 6,
                }}>
                  {saved ? "✓ Salvo!" : "💾 Salvar rascunho"}
                </button>
                {step < steps.length
                  ? <button onClick={() => setStep(step + 1)} style={{ padding: "11px 28px", background: COLORS.primary, color: "#fff", border: "none", borderRadius: 10, cursor: "pointer", fontWeight: 700, fontSize: 14 }}>Próxima etapa →</button>
                  : <button onClick={handlePublish} style={{ padding: "11px 28px", background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.accent})`, color: "#fff", border: "none", borderRadius: 10, cursor: "pointer", fontWeight: 700, fontSize: 14 }}>🚀 Publicar projeto</button>}
              </div>
            </div>
          </div>

          <div style={{ width: 280, flexShrink: 0, display: "flex", flexDirection: "column", gap: 16 }} className="sidebar">
            <ProgressBar currentStep={step} />
            <TipsPanel currentStep={step} />
            {step >= 1 && (data.title || data.area) && <PreviewCard data={data} />}
            <div style={{ background: COLORS.white, borderRadius: 12, padding: "14px 16px", boxShadow: COLORS.cardShadow }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.text, marginBottom: 8 }}>🗂️ Modelos prontos</div>
              {["Projeto de Extensão", "Pesquisa Aplicada", "Voluntariado Comunitário"].map(m => (
                <button key={m} style={{ display: "block", width: "100%", textAlign: "left", background: COLORS.bg, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "8px 12px", marginBottom: 6, cursor: "pointer", fontSize: 12, color: COLORS.textMuted }}>
                  📄 {m}
                </button>
              ))}
            </div>
            <div style={{ background: COLORS.white, borderRadius: 12, padding: "14px 16px", boxShadow: COLORS.cardShadow }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.text, marginBottom: 6 }}>🆘 Precisa de ajuda?</div>
              <div style={{ fontSize: 12, color: COLORS.textMuted, marginBottom: 10, lineHeight: 1.5 }}>Entre em contato com o suporte ou acesse o guia do professor.</div>
              <button style={{ width: "100%", padding: "9px", background: COLORS.primaryLight, color: COLORS.primary, border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600, fontSize: 12 }}>💬 Falar com suporte</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}