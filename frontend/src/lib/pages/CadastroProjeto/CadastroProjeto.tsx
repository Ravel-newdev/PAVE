import { useState } from "react";
import {
  Rocket, Save, CheckCircle, ArrowLeft, ArrowRight,
  PartyPopper,
} from "lucide-react";

import Navbar from "../../layout/components/Navbar/Navbar";
import { COLORS, steps }                                                     from "../../layout/components/CadastroProjeto/constants";
import { StepIndicator, ProgressBar, TipsPanel, PreviewCard, TemplatesPanel } from "../../layout/components/CadastroProjeto/LayoutElements";
import { Step1, Step2, Step3, Step4, Step5 }                                 from "../../layout/components/CadastroProjeto/ProjectSteps";
import type { FormData }                                                      from "../../layout/components/CadastroProjeto/ProjectSteps";

/*  Estado inicial  */
const INITIAL_DATA: FormData = {
  title: "", type: "", area: "", subArea: "", summary: "", banner: "",
  description: "", startDate: "", endDate: "", hours: "", slots: "",
  modality: "", location: "",
  questions: [], docs: [], stages: [],
  inscriptionStart: "", inscriptionEnd: "",
  requirements: [], benefits: [], scholarshipValue: "",
};

/*  Tela de sucesso  */
function PublishedScreen({ onReset }: { onReset: () => void }) {
  return (
    <div style={{ minHeight: "100vh", background: COLORS.bg, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", padding: 24 }}>
      <div style={{ background: COLORS.white, borderRadius: 24, padding: 48, textAlign: "center", boxShadow: "0 8px 40px rgba(40,121,153,0.12)", maxWidth: 480, width: "100%" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
          <PartyPopper size={56} color={COLORS.primary} />
        </div>
        <div style={{ fontSize: 24, fontWeight: 700, color: COLORS.text, marginBottom: 8 }}>Projeto publicado!</div>
        <div style={{ fontSize: 14, color: COLORS.textMuted, marginBottom: 24 }}>
          Seu projeto já está visível no catálogo para todos os estudantes.
        </div>
        <button
          type="button"
          onClick={onReset}
          style={{ padding: "12px 28px", background: COLORS.primary, color: "#fff", border: "none", borderRadius: 12, cursor: "pointer", fontWeight: 600, fontSize: 15 }}
        >
          Criar outro projeto
        </button>
      </div>
    </div>
  );
}

/*  Página  */
export default function CadastroProjeto() {
  const [step,      setStep]      = useState(1);
  const [saved,     setSaved]     = useState(false);
  const [published, setPublished] = useState(false);
  const [data,      setData]      = useState<FormData>(INITIAL_DATA);

  const handleSaveDraft = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };
  const handlePublish   = () => setPublished(true);
  const handleReset     = () => { setPublished(false); setStep(1); setData(INITIAL_DATA); };

  if (published) return <PublishedScreen onReset={handleReset} />;

  const isLastStep  = step === steps.length;
  const showPreview = step >= 1 && (!!data.title || !!data.area);

  return (
    <div style={{ minHeight: "100vh", background: COLORS.bg, fontFamily: "'Lato', 'Segoe UI', sans-serif" }}>
      <Navbar />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 16px" }}>

        {/* Cabeçalho */}
        <div style={{ marginBottom: 8 }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: COLORS.text, margin: 0 }}>Cadastrar novo projeto</h1>
          <p style={{ fontSize: 13, color: COLORS.textMuted, margin: "4px 0 0" }}>
            Campos marcados com <span style={{ color: COLORS.error }}>*</span> são obrigatórios.
          </p>
        </div>

        {/* Indicador de etapas */}
        <div style={{ background: COLORS.white, borderRadius: 16, padding: "20px 24px", boxShadow: COLORS.cardShadow, marginBottom: 24 }}>
          <StepIndicator currentStep={step} setStep={setStep} />
        </div>

        {/* Etapa atual — mobile */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, background: COLORS.white, borderRadius: 16, padding: "14px 20px", boxShadow: COLORS.cardShadow, marginBottom: 24 }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: COLORS.primary, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>
            {step}
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.text }}>{steps[step - 1].label}</div>
            <div style={{ fontSize: 11, color: COLORS.textMuted }}>Etapa {step} de {steps.length}</div>
          </div>
        </div>

        {/*  form e sidebar */}
        <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>

          {/* Formulário */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {step === 1 && <Step1 data={data} setData={setData} />}
            {step === 2 && <Step2 data={data} setData={setData} />}
            {step === 3 && <Step3 data={data} setData={setData} />}
            {step === 4 && <Step4 data={data} setData={setData} />}
            {step === 5 && <Step5 data={data} />}

            {/* Navegação */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
              <button
                type="button"
                onClick={() => step > 1 && setStep(step - 1)}
                style={{ display: "flex", alignItems: "center", gap: 6, padding: "11px 24px", background: "transparent", border: `1.5px solid ${COLORS.border}`, borderRadius: 10, cursor: step > 1 ? "pointer" : "not-allowed", color: step > 1 ? COLORS.text : COLORS.textLight, fontWeight: 600, fontSize: 14 }}
              >
                <ArrowLeft size={16} /> Voltar
              </button>

              <div style={{ display: "flex", gap: 10 }}>
                {/* Salvar rascunho */}
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  style={{ display: "flex", alignItems: "center", gap: 6, padding: "11px 20px", background: "transparent", border: `1.5px solid ${COLORS.border}`, borderRadius: 10, cursor: "pointer", color: COLORS.textMuted, fontWeight: 600, fontSize: 13 }}
                >
                  {saved
                    ? <><CheckCircle size={15} color={COLORS.success} /> Salvo!</>
                    : <><Save size={15} /> Salvar rascunho</>
                  }
                </button>

                {/* Próximo ou publicar */}
                {isLastStep ? (
                  <button
                    type="button"
                    onClick={handlePublish}
                    style={{ display: "flex", alignItems: "center", gap: 6, padding: "11px 28px", background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.accent})`, color: "#fff", border: "none", borderRadius: 10, cursor: "pointer", fontWeight: 700, fontSize: 14 }}
                  >
                    <Rocket size={16} /> Publicar projeto
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setStep(step + 1)}
                    style={{ display: "flex", alignItems: "center", gap: 6, padding: "11px 28px", background: COLORS.primary, color: "#fff", border: "none", borderRadius: 10, cursor: "pointer", fontWeight: 700, fontSize: 14 }}
                  >
                    Próxima etapa <ArrowRight size={16} />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ width: 280, flexShrink: 0, display: "flex", flexDirection: "column", gap: 16 }}>
            <ProgressBar  currentStep={step} />
            <TipsPanel    currentStep={step} />
            {showPreview && <PreviewCard data={data} />}
            <TemplatesPanel />
          </div>
        </div>
      </div>
    </div>
  );
}