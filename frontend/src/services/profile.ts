import { api } from "./constants";
import type { ProfileFormData, ProfileResponse } from "@/types/perfilAluno";

export async function getProfile() {
  return api.get<ProfileResponse>("/profile");
}

export async function updateProfile(
  data: Omit<
    ProfileFormData,
    "currentPassword" | "newPassword" | "confirmPassword"
  >
) {
  return api.put("/profile", data);
}

export async function uploadAvatar(file: File) {
  const formData = new FormData();

  formData.append("avatar", file);

  return api.post<{ url: string }>(
    "/profile/avatar",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
}

export async function updatePassword(
  currentPassword: string,
  newPassword: string,
) {
  return api.put("/profile/password", {
    currentPassword,
    newPassword,
  });
}