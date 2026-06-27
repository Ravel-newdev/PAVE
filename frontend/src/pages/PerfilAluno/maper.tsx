import {
  type ProfileFormData,
  type ProfileResponse,
} from "@/types/perfilAluno";

export function profileResponseToForm(
  profile: ProfileResponse,
): ProfileFormData {
  return {
    firstName: profile.firstName ?? "",
    lastName: profile.lastName ?? "",
    email: profile.email ?? "",
    phone: profile.phone ?? "",
    birthDate: profile.birthDate ?? "",
    avatar: profile.avatar ?? "",
    institution: profile.institution ?? "",
    course: profile.course ?? "",
    semester: profile.semester ?? "",
    graduationYear: profile.graduationYear ?? "",
    about: profile.about ?? "",
    interests: profile.interests ?? [],
    curriculo_url: profile.curriculo_url ?? "",
    availability: profile.availability,
    remote: profile.remote ?? false,
    notifications: profile.notifications ?? true,
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  };
}

export function profileFormToRequest(data: ProfileFormData) {
  return {
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    phone: data.phone,
    birthDate: data.birthDate,
    avatar: data.avatar,
    institution: data.institution,
    course: data.course,
    semester: data.semester,
    graduationYear: data.graduationYear,
    about: data.about,
    interests: data.interests,
    curriculo_url: data.curriculo_url,
    availability: data.availability,
    remote: data.remote,
    notifications: data.notifications,
  };
}
