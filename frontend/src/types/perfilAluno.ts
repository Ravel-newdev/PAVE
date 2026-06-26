import { z } from "zod";
import { profileSchema } from "@/pages/PerfilAluno/schema";

export type ProfileFormData = z.infer<typeof profileSchema>;

export interface Experience {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
}

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

  experiences: Experience[];

  availability: "morning" | "afternoon" | "night" | "fulltime";

  remote: boolean;

  notifications: boolean;
}