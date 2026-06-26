import { ArrowLeft, Save } from "lucide-react";
import { Button } from "../ui/button";
import { Link } from "@tanstack/react-router";

interface ProfileHeaderProps {
  onSave: () => void;
}

export function ProfileHeader({ onSave }: ProfileHeaderProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Link>

          <div className="mt-4">
            <h1 className="text-3xl font-bold tracking-tight">
              Meu Perfil
            </h1>

            <p className="text-muted-foreground mt-1">
              Gerencie suas informações pessoais, acadêmicas e preferências.
            </p>
          </div>
        </div>

        <Button
          onClick={onSave}
          className="gap-2"
        >
          <Save className="h-4 w-4" />
          Salvar alterações
        </Button>
      </div>
    </div>
  );
}