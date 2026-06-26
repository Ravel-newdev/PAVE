import { useState } from "react";
import { COLORS } from "./constants";

/*  Tipos base dos campos  */
interface BaseFieldProps {
  label: string;
  required?: boolean;
  hint?: string;
}

interface InputFieldProps extends BaseFieldProps {
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  maxLength?: number;
}

interface SelectFieldProps extends BaseFieldProps {
  options: string[];
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}

interface TextAreaFieldProps extends BaseFieldProps {
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  maxLength?: number;
  rows?: number;
}

interface CardProps {
  children: React.ReactNode;
  title?: string;
  icon?: React.ReactNode;
}

/*  Campo de input  */
export function InputField({
  label, required, placeholder, value, onChange,
  type = "text", maxLength, hint,
}: InputFieldProps) {
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
        onChange={(e) => { onChange(e.target.value); setCount(e.target.value.length); }}
        style={{ width: "100%", padding: "10px 14px", border: `1.5px solid ${COLORS.border}`, borderRadius: 10, fontSize: 14, color: COLORS.text, background: COLORS.white, outline: "none", boxSizing: "border-box", fontFamily: "inherit" }}
      />
      {maxLength && (
        <div style={{ textAlign: "right", fontSize: 11, color: COLORS.textMuted, marginTop: 4 }}>
          {count}/{maxLength}
        </div>
      )}
    </div>
  );
}

/*  Campo de select  */
export function SelectField({
  label, required, options, value, onChange, placeholder,
}: SelectFieldProps) {
  return (
    <div style={{ marginBottom: 20 }}>
      <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: COLORS.text, marginBottom: 6 }}>
        {label} {required && <span style={{ color: COLORS.error }}>*</span>}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ width: "100%", padding: "10px 14px", border: `1.5px solid ${COLORS.border}`, borderRadius: 10, fontSize: 14, color: value ? COLORS.text : COLORS.textLight, background: COLORS.white, outline: "none", boxSizing: "border-box", fontFamily: "inherit", cursor: "pointer" }}
      >
        <option value="">{placeholder ?? "Selecione..."}</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

/*  Campo de textarea  */
export function TextAreaField({
  label, required, placeholder, value, onChange,
  maxLength, hint, rows = 4,
}: TextAreaFieldProps) {
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
        onChange={(e) => { onChange(e.target.value); setCount(e.target.value.length); }}
        style={{ width: "100%", padding: "10px 14px", border: `1.5px solid ${COLORS.border}`, borderRadius: 10, fontSize: 14, color: COLORS.text, background: COLORS.white, outline: "none", boxSizing: "border-box", fontFamily: "inherit", resize: "vertical" }}
      />
      {maxLength && (
        <div style={{ textAlign: "right", fontSize: 11, color: COLORS.textMuted, marginTop: 4 }}>
          {count}/{maxLength}
        </div>
      )}
    </div>
  );
}

/*  Card de seção  */
export function Card({ children, title, icon }: CardProps) {
  return (
    <div style={{ background: COLORS.white, borderRadius: 16, padding: 24, boxShadow: COLORS.cardShadow, marginBottom: 20 }}>
      {title && (
        <div style={{ fontSize: 16, fontWeight: 700, color: COLORS.text, marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
          {icon && <span style={{ display: "flex", alignItems: "center", fontSize: 20, color: COLORS.primary }}>{icon}</span>}
          {title}
        </div>
      )}
      {children}
    </div>
  );
}

export function FieldLabel({
  children,
  className,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label className={className} {...props}>
      {children}
    </label>
  );
}
 
export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} />;
}
 
export function Button({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={className} {...props}>
      {children}
    </button>
  );
}
