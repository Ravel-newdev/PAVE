import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "../ui/form";
import { Input } from "../ui/input";
import { X } from "lucide-react";
import { type Control, useController } from "react-hook-form";
import type { ProfileFormData } from "@/types/perfilAluno";
import { useState } from "react";

interface Props {
  control: Control<ProfileFormData>;
}

export function InterestSelect({ control }: Props) {
  const [value, setValue] = useState("");

  const { field } = useController({
    control,
    name: "interests",
  });

  const interests: string[] = field.value ?? [];

  function addInterest() {
    const interest = value.trim();

    if (!interest) return;

    if (interests.includes(interest)) {
      setValue("");
      return;
    }

    field.onChange([...interests, interest]);
    setValue("");
  }

  function removeInterest(index: number) {
    field.onChange(interests.filter((_, i) => i !== index));
  }

  return (
    <FormField
      control={control}
      name="interests"
      render={() => (
        <FormItem className="space-y-4">
          <FormLabel>Áreas de interesse</FormLabel>

          <div className="flex gap-2">
            <Input
              value={value}
              placeholder="Adicionar interesse"
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addInterest();
                }
              }}
            />

            <Button
              type="button"
              onClick={addInterest}
            >
              Adicionar
            </Button>
          </div>

          <FormControl>
            <div className="flex flex-wrap gap-2">
              {interests.map((interest, index) => (
                <Badge
                  key={interest}
                  className="gap-2"
                >
                  {interest}

                  <button
                    type="button"
                    onClick={() => removeInterest(index)}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </FormControl>
        </FormItem>
      )}
    />
  );
}