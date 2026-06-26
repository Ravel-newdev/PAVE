import { ChevronDown } from "lucide-react";

interface SelectDropdownProps {
  label: string;
  options: readonly string[];
  value: string;
  onChange: (v: string) => void;
}

export function SelectDropdown({ label, options, value, onChange }: SelectDropdownProps) {
  return (
    <div className="cat-select-wrap">
      <span className="cat-select-label">{label}</span>
      <div className="cat-select">
        <select value={value} onChange={(e) => onChange(e.target.value)}>
          {options.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
        <ChevronDown size={14} className="cat-select-chevron" />
      </div>
    </div>
  );
}