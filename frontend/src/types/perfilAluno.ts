import { z } from "zod";
import { profileSchema } from "@/pages/PerfilAluno/schema";

export type ProfileFormData = z.infer<typeof profileSchema>;

export interface ProfileResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthDate: string;
  avatar: string | null;
  institution: string;
  course: string;
  semester: string;
  graduationYear: string;
  about: string;
  interests: string[];
  curriculo_url: string | null;
  availability: "morning" | "afternoon" | "night" | "fulltime" | undefined;
  remote: boolean;
  notifications: boolean;
}
