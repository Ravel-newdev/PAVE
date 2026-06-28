import type { ProfileFormData } from "@/types/perfilAluno";

export const defaultProfileValues: ProfileFormData = {
  firstName: "",
  lastName: "",
  email: "",
  avatar: "",
  course: "",
  semester: "",
  about: "",
  interests: [],
  curriculo_url: "",
  availability: undefined,
  remote: false,
  notifications: true,
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};
