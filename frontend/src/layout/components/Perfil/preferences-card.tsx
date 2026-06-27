import type { Control } from "react-hook-form";
import type { ProfileFormData } from "@/types/perfilAluno";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../ui/card";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import { Checkbox } from "../ui/checkbox";

interface Props {
  control: Control<ProfileFormData>;
}

export function PreferencesCard({
  control,
}: Props) {
  return (
    <Card>

      <CardHeader>

        <CardTitle>
          Preferências
        </CardTitle>

      </CardHeader>

      <CardContent className="space-y-6">

        <FormField
          control={control}
          name="availability"
          render={({ field }) => (
            <FormItem>

              <FormLabel>
                Disponibilidade
              </FormLabel>

              <Select
                value={field.value}
                onValueChange={field.onChange}
              >
                <FormControl>

                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>

                </FormControl>

                <SelectContent>

                  <SelectItem value="morning">
                    Manhã
                  </SelectItem>

                  <SelectItem value="afternoon">
                    Tarde
                  </SelectItem>

                  <SelectItem value="night">
                    Noite
                  </SelectItem>

                  <SelectItem value="fulltime">
                    Integral
                  </SelectItem>

                </SelectContent>

              </Select>

              <FormMessage />

            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="remote"
          render={({ field }) => (
            <FormItem className="flex items-center gap-3">

              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />

              <FormLabel className="font-normal">
                Aceito projetos remotos
              </FormLabel>

            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="notifications"
          render={({ field }) => (
            <FormItem className="flex items-center gap-3">

              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />

              <FormLabel className="font-normal">
                Receber notificações por e-mail
              </FormLabel>

            </FormItem>
          )}
        />

      </CardContent>

    </Card>
  );
}