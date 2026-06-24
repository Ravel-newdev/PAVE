import {
  Pencil, Image, Sparkles,           // Step 1 tips
  Rocket, CalendarDays, MapPin,      // Step 2 tips
  HelpCircle, Paperclip, Clock,      // Step 3 tips
  ClipboardList, Gift, Search,       // Step 4 tips
  CheckCircle2, Eye, SendHorizonal,  // Step 5 tips
  CheckCheck, Star, Layers,          // misc sidebar
  Save,
} from "lucide-react";

import { COLORS, steps, tipLabelsByStep } from "./constants";

const TIP_ICONS: Record<number, React.ReactNode[]> = {
  1: [<Pencil size={16} />,        <Image size={16} />,       <Sparkles size={16} />    ],
  2: [<Rocket size={16} />,        <CalendarDays size={16} />,<MapPin size={16} />       ],
  3: [<HelpCircle size={16} />,    <Paperclip size={16} />,   <Clock size={16} />        ],
  4: [<ClipboardList size={16} />, <Gift size={16} />,        <Search size={16} />       ],
  5: [<CheckCircle2 size={16} />,  <Eye size={16} />,         <SendHorizonal size={16} />],
};

/*  Indicador de etapas  */
export function StepIndicator({
  currentStep,
  setStep,
}: {
  currentStep: number;
  setStep: (n: number) => void;
}) {
  return (
    <div style={{ overflowX: "auto", paddingBottom: 4 }}>
      <div style={{ display: "flex", alignItems: "center", minWidth: 600 }}>
        {steps.map((step, i) => {
          const done   = step.id < currentStep;
          const active = step.id === currentStep;
          return (
            <div key={step.id} style={{ display: "flex", alignItems: "center", flex: 1 }}>
              <button
                type="button"
                onClick={() => done && setStep(step.id)}
                style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: done ? "pointer" : "default", padding: "8px 0" }}
              >
                <div style={{
                  width: 32, height: 32, borderRadius: "50%",
                  background: active ? COLORS.primary : done ? COLORS.accent : COLORS.border,
                  color: active || done ? "#fff" : COLORS.textMuted,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: 700, transition: "all 0.3s", flexShrink: 0,
                }}>
                  {done
                    ? <CheckCheck size={15} />
                    : <span style={{ fontSize: 13 }}>{step.id}</span>
                  }
                </div>
                <span style={{
                  fontSize: 13, fontWeight: active ? 600 : 400,
                  color: active ? COLORS.primary : done ? COLORS.accent : COLORS.textMuted,
                  whiteSpace: "nowrap",
                }}>
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

/*  Barra de progresso  */
export function ProgressBar({ currentStep }: { currentStep: number }) {
  const pct = Math.round(((currentStep - 1) / (steps.length - 1)) * 100);
  return (
    <div style={{ background: COLORS.white, borderRadius: 12, padding: "12px 16px", boxShadow: COLORS.cardShadow }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: COLORS.text, display: "flex", alignItems: "center", gap: 6 }}>
          <Layers size={14} color={COLORS.primary} /> Progresso do cadastro
        </span>
        <span style={{ fontSize: 12, color: COLORS.textMuted }}>Etapa {currentStep} de {steps.length}</span>
      </div>
      <div style={{ background: COLORS.border, borderRadius: 999, height: 8, overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.accent})`, borderRadius: 999, transition: "width 0.5s ease" }} />
      </div>
      <div style={{ textAlign: "right", fontSize: 11, color: COLORS.primary, fontWeight: 600, marginTop: 4 }}>{pct}%</div>
    </div>
  );
}

/*  Painel de dicas  */
export function TipsPanel({ currentStep }: { currentStep: number }) {
  const labels = tipLabelsByStep[currentStep] ?? [];
  const icons  = TIP_ICONS[currentStep]       ?? [];
  return (
    <div style={{ background: COLORS.white, borderRadius: 12, padding: 16, boxShadow: COLORS.cardShadow }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.text, marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
        <Star size={15} color={COLORS.warning} fill={COLORS.warning} />
        Dicas para um bom cadastro
      </div>
      {labels.map((tip, i) => (
        <div key={i} style={{ display: "flex", gap: 10, marginBottom: 12 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: COLORS.primaryLight, display: "flex", alignItems: "center", justifyContent: "center", color: COLORS.primary, flexShrink: 0 }}>
            {icons[i]}
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: COLORS.text }}>{tip.title}</div>
            <div style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 2, lineHeight: 1.4 }}>{tip.desc}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

/*  Preview do card  */
interface PreviewData {
  title: string;
  summary: string;
  area: string;
  modality: string;
  type: string;
  banner: string;
}

export function PreviewCard({ data }: { data: PreviewData }) {
  return (
    <div style={{ background: COLORS.white, borderRadius: 12, padding: 16, boxShadow: COLORS.cardShadow }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.text, marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
        <Eye size={14} color={COLORS.primary} /> Preview do card
      </div>
      <div style={{ borderRadius: 12, overflow: "hidden", border: `1px solid ${COLORS.border}` }}>
        <div style={{
          height: 80,
          background: data.banner
            ? `url(${data.banner}) center/cover`
            : `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.accent})`,
          display: "flex", alignItems: "flex-end", padding: 10,
        }}>
          {data.type && (
            <span style={{ background: "rgba(255,255,255,0.2)", backdropFilter: "blur(4px)", color: "#fff", fontSize: 10, padding: "2px 8px", borderRadius: 999, fontWeight: 600 }}>
              {data.type}
            </span>
          )}
        </div>
        <div style={{ padding: "10px 12px" }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.text, marginBottom: 4 }}>
            {data.title || "Título do projeto..."}
          </div>
          <div style={{ fontSize: 11, color: COLORS.textMuted, lineHeight: 1.4 }}>
            {data.summary?.slice(0, 80) || "Resumo do projeto aparecerá aqui..."}
            {data.summary?.length > 80 ? "..." : ""}
          </div>
          {data.area && (
            <div style={{ marginTop: 8, display: "flex", gap: 4 }}>
              <span style={{ background: COLORS.primaryLight, color: COLORS.primary, fontSize: 10, padding: "2px 8px", borderRadius: 999 }}>{data.area}</span>
              {data.modality && (
                <span style={{ background: "#f0f4f0", color: COLORS.textMuted, fontSize: 10, padding: "2px 8px", borderRadius: 999 }}>{data.modality}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/*  Modelos prontos  */
export function TemplatesPanel() {
  const modelos = [
    { label: "Projeto de Extensão",       icon: <ClipboardList size={13} color={COLORS.primary} /> },
    { label: "Pesquisa Aplicada",         icon: <Search size={13} color={COLORS.primary} />        },
    { label: "Voluntariado Comunitário",  icon: <Gift size={13} color={COLORS.primary} />          },
  ];
  return (
    <div style={{ background: COLORS.white, borderRadius: 12, padding: "14px 16px", boxShadow: COLORS.cardShadow }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.text, marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
        <Layers size={14} color={COLORS.primary} /> Modelos prontos
      </div>
      {modelos.map(({ label, icon }) => (
        <button
          key={label}
          type="button"
          style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", textAlign: "left", background: COLORS.bg, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "8px 12px", marginBottom: 6, cursor: "pointer", fontSize: 12, color: COLORS.textMuted }}
        >
          {icon} {label}
        </button>
      ))}
    </div>
  );
}

export { Save };