import type { ProfileFormData } from "@/types/perfilAluno";

export const defaultProfileValues: ProfileFormData = {
  firstName: "",
  lastName: "",

  email: "",
  phone: "",

  birthDate: "",

  avatar: "",

  institution: "",
  course: "",
  semester: "",
  graduationYear: "",

  about: "",

  interests: [],

  experiences: [],

  availability: "fulltime",

  remote: false,

  notifications: true,

  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};