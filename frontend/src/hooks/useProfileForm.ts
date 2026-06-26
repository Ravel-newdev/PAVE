import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { profileSchema } from "@/pages/PerfilAluno/schema";
import { defaultProfileValues } from "@/pages/PerfilAluno/default-values";
import type { ProfileFormData } from "@/types/perfilAluno";

export function useProfileForm() {
  return useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),

    defaultValues: defaultProfileValues,

    mode: "onSubmit",

    reValidateMode: "onChange",
  });
}