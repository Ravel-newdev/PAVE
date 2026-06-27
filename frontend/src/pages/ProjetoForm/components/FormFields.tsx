import type { ReactNode } from "react";

export function FieldLabel({ children, required = false }: { children: ReactNode; required?: boolean }) {
  return (
    <label className="pf-label">
      {children} {required && <span>*</span>}
    </label>
  );
}

export function SelectField({ value, onChange, placeholder, options }: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  options: string[];
}) {
  return (
    <select value={value} onChange={(event) => onChange(event.target.value)} className="pf-input">
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option value={option} key={option}>{option}</option>
      ))}
    </select>
  );
}

export function Section({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  return (
    <section className="pf-card">
      <h2 className="pf-section-title">
        <span>{icon}</span>
        {title}
      </h2>
      {children}
    </section>
  );
}

