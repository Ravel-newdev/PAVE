import { useState } from "react";
import {
  ClipboardList, Camera, BookOpen, CalendarDays,
  HelpCircle, X, Plus, Paperclip,
  CheckCircle2, Check, Gift, SendHorizonal,
} from "lucide-react";
import { COLORS, areaOptions, subAreaMap } from "./constants";
import { Card, InputField, SelectField, TextAreaField } from "./FormElements";

/* ─── Tipo do formulário ─── */
export interface FormData {
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

interface StepProps {
  data: FormData;
  setData: (d: FormData) => void;
}

/* Informações Gerais  */
export function Step1({ data, setData }: StepProps) {
  return (
    <>
      <Card title="Informações Gerais" icon={<ClipboardList size={20} />}>
        <InputField
          label="Título do projeto" required
          placeholder="Ex.: Sustentabilidade na Comunidade"
          value={data.title} onChange={(v) => setData({ ...data, title: v })} maxLength={100}
        />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <SelectField
            label="Tipo de oportunidade" required
            options={["Voluntariado", "Bolsa", "Extensão", "Pesquisa"]}
            value={data.type} onChange={(v) => setData({ ...data, type: v })}
          />
          <SelectField
            label="Área do projeto" required
            options={areaOptions}
            value={data.area} onChange={(v) => setData({ ...data, area: v, subArea: "" })}
          />
        </div>
        <SelectField
          label="Subárea"
          options={subAreaMap[data.area] ?? []}
          value={data.subArea} onChange={(v) => setData({ ...data, subArea: v })}
          placeholder="Selecione a subárea (opcional)"
        />
        <TextAreaField
          label="Resumo do projeto" required
          placeholder="Descreva brevemente o objetivo e impacto do projeto..."
          value={data.summary} onChange={(v) => setData({ ...data, summary: v })}
          maxLength={200} rows={3}
          hint="Será exibido no catálogo de projetos. Seja conciso e impactante."
        />
      </Card>

      <Card title="Imagem / Banner do Projeto" icon={<Camera size={20} />}>
        <div
          style={{ border: `2px dashed ${COLORS.border}`, borderRadius: 12, padding: 32, textAlign: "center", background: COLORS.bg, cursor: "pointer" }}
          onClick={() => document.getElementById("banner-upload")?.click()}
        >
          {data.banner ? (
            <img src={data.banner} alt="Banner" style={{ maxHeight: 160, borderRadius: 8, objectFit: "cover" }} />
          ) : (
            <>
              <Camera size={36} style={{ marginBottom: 8 }} color={COLORS.textMuted} />
              <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.textMuted }}>Clique para fazer upload</div>
              <div style={{ fontSize: 12, color: COLORS.textLight, marginTop: 4 }}>PNG, JPG ou WEBP • Recomendado: 1200×400px</div>
            </>
          )}
          <input
            id="banner-upload" type="file" accept="image/*" style={{ display: "none" }}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) setData({ ...data, banner: URL.createObjectURL(file) });
            }}
          />
        </div>
      </Card>
    </>
  );
}

/* Detalhes  */
export function Step2({ data, setData }: StepProps) {
  return (
    <>
      <Card title="Descrição Completa" icon={<BookOpen size={20} />}>
        <textarea
          placeholder="Descreva o projeto com detalhes..."
          value={data.description} rows={8} maxLength={3000}
          onChange={(e) => setData({ ...data, description: e.target.value })}
          style={{ width: "100%", padding: "12px 14px", border: `1.5px solid ${COLORS.border}`, borderRadius: 10, fontSize: 14, color: COLORS.text, background: COLORS.white, outline: "none", boxSizing: "border-box", fontFamily: "inherit", resize: "vertical" }}
        />
      </Card>

      <Card title="Período e Logística" icon={<CalendarDays size={20} />}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <InputField label="Data de início" required type="date" value={data.startDate} onChange={(v) => setData({ ...data, startDate: v })} />
          <InputField label="Data de fim"    required type="date" value={data.endDate}   onChange={(v) => setData({ ...data, endDate: v })} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <InputField label="Carga horária semanal" required placeholder="Ex.: 12 horas" value={data.hours} onChange={(v) => setData({ ...data, hours: v })} />
          <InputField label="Número de vagas"       required placeholder="Ex.: 15"       type="number" value={data.slots} onChange={(v) => setData({ ...data, slots: v })} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <SelectField label="Modalidade" required options={["Presencial", "Remoto", "Híbrido"]} value={data.modality} onChange={(v) => setData({ ...data, modality: v })} />
          <InputField  label="Local / Campus" placeholder="Ex.: Campus do Pici" value={data.location} onChange={(v) => setData({ ...data, location: v })} />
        </div>
      </Card>
    </>
  );
}

/* Processo Seletivo  */
export function Step3({ data, setData }: StepProps) {
  const [newQuestion, setNewQuestion] = useState("");

  const addQuestion = () => {
    if (!newQuestion.trim()) return;
    setData({ ...data, questions: [...data.questions, newQuestion.trim()] });
    setNewQuestion("");
  };

  const removeQuestion = (i: number) =>
    setData({ ...data, questions: data.questions.filter((_, j) => j !== i) });

  const toggleDoc = (doc: string, checked: boolean) => {
    const docs = checked
      ? [...data.docs, doc]
      : data.docs.filter((d) => d !== doc);
    setData({ ...data, docs });
  };

  const DOCS = ["Currículo", "Histórico Escolar", "Portfólio", "Carta de Motivação"];

  return (
    <>
      <Card title="Formulário Personalizado" icon={<HelpCircle size={20} />}>
        {data.questions.map((q, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, background: COLORS.bg, borderRadius: 8, padding: "10px 14px", marginBottom: 8 }}>
            <span style={{ fontSize: 13, flex: 1, color: COLORS.text, display: "flex", alignItems: "center", gap: 6 }}>
              <HelpCircle size={14} color={COLORS.primary} /> {q}
            </span>
            <button type="button" onClick={() => removeQuestion(i)} style={{ background: "none", border: "none", cursor: "pointer", color: COLORS.error, fontSize: 16, display: "flex", alignItems: "center" }}>
              <X size={16} />
            </button>
          </div>
        ))}
        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          <input
            placeholder='Ex.: "Por que deseja participar deste projeto?"'
            value={newQuestion} onChange={(e) => setNewQuestion(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addQuestion()}
            style={{ flex: 1, padding: "10px 14px", border: `1.5px solid ${COLORS.border}`, borderRadius: 10, fontSize: 13, fontFamily: "inherit", outline: "none" }}
          />
          <button type="button" onClick={addQuestion} style={{ padding: "10px 16px", background: COLORS.primary, color: "#fff", border: "none", borderRadius: 10, cursor: "pointer", fontWeight: 600, fontSize: 16, display: "flex", alignItems: "center" }}>
            <Plus size={16} />
          </button>
        </div>
      </Card>

      <Card title="Documentos Exigidos" icon={<Paperclip size={20} />}>
        {DOCS.map((doc) => (
          <label key={doc} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={data.docs.includes(doc)}
              onChange={(e) => toggleDoc(doc, e.target.checked)}
              style={{ width: 16, height: 16, accentColor: COLORS.primary }}
            />
            <span style={{ fontSize: 13, color: COLORS.text }}>{doc}</span>
          </label>
        ))}
      </Card>
    </>
  );
}

/* Requisitos e Benefícios  */
export function Step4({ data, setData }: StepProps) {
  const [newReq, setNewReq] = useState("");

  const addReq = () => {
    if (!newReq.trim()) return;
    setData({ ...data, requirements: [...data.requirements, newReq.trim()] });
    setNewReq("");
  };

  const removeReq = (i: number) =>
    setData({ ...data, requirements: data.requirements.filter((_, j) => j !== i) });

  const toggleBenefit = (b: string, checked: boolean) => {
    const benefits = checked
      ? [...data.benefits, b]
      : data.benefits.filter((x) => x !== b);
    setData({ ...data, benefits });
  };

  const BENEFITS = [
    "Certificado de participação", "Bolsa financeira", "Horas complementares",
    "Mentoria com professor", "Publicação de artigo", "Experiência prática",
  ];

  return (
    <>
      <Card title="Requisitos para Participação" icon={<CheckCircle2 size={20} />}>
        {data.requirements.map((r, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, background: COLORS.bg, borderRadius: 8, padding: "10px 14px", marginBottom: 8 }}>
            <span style={{ fontSize: 13, flex: 1, color: COLORS.text, display: "flex", alignItems: "center", gap: 6 }}>
              <Check size={14} color={COLORS.success} /> {r}
            </span>
            <button type="button" onClick={() => removeReq(i)} style={{ background: "none", border: "none", cursor: "pointer", color: COLORS.error, fontSize: 16, display: "flex", alignItems: "center" }}>
              <X size={16} />
            </button>
          </div>
        ))}
        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          <input
            placeholder="Ex.: Boa comunicação..."
            value={newReq} onChange={(e) => setNewReq(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") addReq(); }}
            style={{ flex: 1, padding: "10px 14px", border: `1.5px solid ${COLORS.border}`, borderRadius: 10, fontSize: 13, fontFamily: "inherit", outline: "none" }}
          />
          <button type="button" onClick={addReq} style={{ padding: "10px 16px", background: COLORS.primary, color: "#fff", border: "none", borderRadius: 10, cursor: "pointer", fontWeight: 600, fontSize: 16, display: "flex", alignItems: "center" }}>
            <Plus size={16} />
          </button>
        </div>
      </Card>

      <Card title="Benefícios para Participantes" icon={<Gift size={20} />}>
        {BENEFITS.map((benefit) => (
          <label key={benefit} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={data.benefits.includes(benefit)}
              onChange={(e) => toggleBenefit(benefit, e.target.checked)}
              style={{ width: 16, height: 16, accentColor: COLORS.primary }}
            />
            <span style={{ fontSize: 13, color: COLORS.text }}>{benefit}</span>
          </label>
        ))}
      </Card>
    </>
  );
}

/*  Revisão  */
export function Step5({ data }: { data: FormData }) {
  return (
    <>
      <Card title="Resumo do Projeto" icon={<ClipboardList size={20} />}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {[
            { label: "Título",     value: data.title    },
            { label: "Área",       value: data.area     },
            { label: "Tipo",       value: data.type     },
            { label: "Modalidade", value: data.modality },
            { label: "Vagas",      value: data.slots    },
            { label: "Período",    value: data.startDate && data.endDate ? `${data.startDate} → ${data.endDate}` : "" },
          ].map(({ label, value }) => (
            <div key={label} style={{ background: COLORS.bg, borderRadius: 8, padding: "10px 12px" }}>
              <div style={{ fontSize: 11, color: COLORS.textMuted, marginBottom: 2 }}>{label}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.text }}>{value || "—"}</div>
            </div>
          ))}
        </div>

        {data.summary && (
          <div style={{ marginTop: 16, background: COLORS.bg, borderRadius: 8, padding: "12px 14px" }}>
            <div style={{ fontSize: 11, color: COLORS.textMuted, marginBottom: 4 }}>Resumo</div>
            <div style={{ fontSize: 13, color: COLORS.text, lineHeight: 1.5 }}>{data.summary}</div>
          </div>
        )}

        {data.requirements.length > 0 && (
          <div style={{ marginTop: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: COLORS.textMuted, marginBottom: 8 }}>Requisitos</div>
            {data.requirements.map((r, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: COLORS.text, marginBottom: 4 }}>
                <Check size={14} color={COLORS.success} /> {r}
              </div>
            ))}
          </div>
        )}

        {data.benefits.length > 0 && (
          <div style={{ marginTop: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: COLORS.textMuted, marginBottom: 8 }}>Benefícios</div>
            {data.benefits.map((b, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: COLORS.text, marginBottom: 4 }}>
                <Gift size={14} color={COLORS.primary} /> {b}
              </div>
            ))}
          </div>
        )}
      </Card>

      <div style={{ background: `linear-gradient(135deg, ${COLORS.primaryLight}, #e8f8f0)`, borderRadius: 16, padding: 24, textAlign: "center" }}>
        <SendHorizonal size={32} style={{ marginBottom: 8 }} color={COLORS.primary} />
        <div style={{ fontSize: 16, fontWeight: 700, color: COLORS.text, marginBottom: 4 }}>Tudo pronto para publicar!</div>
        <div style={{ fontSize: 13, color: COLORS.textMuted }}>Seu projeto ficará visível para todos os estudantes da plataforma.</div>
      </div>
    </>
  );
}