import { Plus } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../ui/card";

import { Button } from "../ui/button";

import {
  type Control,
  useFieldArray,
} from "react-hook-form";
import type { ProfileFormData } from "@/types/perfilAluno";

import { ExperienceItem } from "./experience-item";

interface Props {
  control: Control<ProfileFormData>;
}

export function ExperienceCard({
  control,
}: Props) {
  const {
    fields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "experiences",
  });

  function addExperience() {
    append({
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      description: "",
  });
}
  return (
    <Card>

      <CardHeader className="flex flex-row items-center justify-between">

        <CardTitle>
          Experiência profissional
        </CardTitle>

        <Button
          type="button"
          onClick={addExperience}
        >
          <Plus className="mr-2 h-4 w-4" />
          Adicionar
        </Button>

      </CardHeader>

      <CardContent className="space-y-4">

        {fields.length === 0 && (
          <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
            Nenhuma experiência cadastrada.
          </div>
        )}

        {fields.map((field, index) => (
          <ExperienceItem
            key={field.id}
            control={control}
            index={index}
            remove={remove}
          />
        ))}

      </CardContent>

    </Card>
  );
}