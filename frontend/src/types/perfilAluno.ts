import { z } from "zod";
import { profileSchema } from "@/pages/PerfilAluno/schema";

export type ProfileFormData = z.infer<typeof profileSchema>;

