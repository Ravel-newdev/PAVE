import { Trash2 } from "lucide-react";

import {
  Card,
  CardContent,
} from "../ui/card";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import type { Control } from "react-hook-form";
import { Textarea } from "../ui/textarea";
import type { ProfileFormData } from "@/types/perfilAluno";

interface Props {
  control: Control<ProfileFormData>;
  index: number;
  remove(index: number): void;
}

export function ExperienceItem({
  control,
  index,
  remove,
}: Props) {
  return (
    <Card>

      <CardContent className="pt-6">

        <div className="grid md:grid-cols-2 gap-6">

          <FormField
            control={control}
            name={`experiences.${index}.company`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Empresa</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name={`experiences.${index}.position`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cargo</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name={`experiences.${index}.startDate`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Início</FormLabel>
                <FormControl>
                  <Input type="month" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name={`experiences.${index}.endDate`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fim <span className="text-muted-foreground font-normal">(opcional)</span></FormLabel>
                <FormControl>
                  <Input type="month" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name={`experiences.${index}.description`}
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Descrição <span className="text-muted-foreground font-normal">(opcional)</span></FormLabel>
                <FormControl>
                  <Textarea
                    rows={4}
                    placeholder="Descreva suas atividades..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

        </div>

        <div className="mt-6 flex justify-end">

          <Button
            type="button"
            variant="destructive"
            onClick={() => remove(index)}
          >
            <Trash2 className="mr-2 h-4 w-4" />

            Remover experiência
          </Button>

        </div>

      </CardContent>

    </Card>
  );
}