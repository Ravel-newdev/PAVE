import type { ProfileFormData } from "@/types/perfilAluno";
import type { Control } from "react-hook-form";

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

import { Input } from "../ui/input";

import { Button } from "../ui/button";

interface Props {
  control: Control<ProfileFormData>;
}

export function SecurityCard({
  control,
}: Props) {
  return (
    <Card>

      <CardHeader>

        <CardTitle>
          Segurança
        </CardTitle>

      </CardHeader>

      <CardContent className="space-y-6">

        <FormField
          control={control}
          name="currentPassword"
          render={({ field }) => (
            <FormItem>

              <FormLabel>
                Senha atual
              </FormLabel>

              <FormControl>

                <Input
                  type="password"
                  {...field}
                />

              </FormControl>

              <FormMessage />

            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>

              <FormLabel>
                Nova senha
              </FormLabel>

              <FormControl>

                <Input
                  type="password"
                  {...field}
                />

              </FormControl>

              <FormMessage />

            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>

              <FormLabel>
                Confirmar senha
              </FormLabel>

              <FormControl>

                <Input
                  type="password"
                  {...field}
                />

              </FormControl>

              <FormMessage />

            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full"
        >
          Atualizar senha
        </Button>

      </CardContent>

    </Card>
  );
}