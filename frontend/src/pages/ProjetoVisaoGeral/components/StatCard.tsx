import type { ReactNode } from "react";
import type { StatVariant } from "../types/projetoVisaoTypes";

type StatCardProps = {
  icon: ReactNode;
  value: number;
  label: string;
  variant: StatVariant;
};

export function StatCard({ icon, value, label, variant }: StatCardProps) {
  return (
    <div className={`po-stat po-stat-${variant}`}>
      <span>{icon}</span>
      <strong>{value}</strong>
      <small>{label}</small>
    </div>
  );
}
