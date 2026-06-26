import {
  type ProfileFormData,
  type ProfileResponse,
} from "@/types/perfilAluno";

export function profileResponseToForm(
  profile: ProfileResponse,
): ProfileFormData {
  return {
    firstName: profile.firstName,
    lastName: profile.lastName,

    email: profile.email,
    phone: profile.phone,

    birthDate: profile.birthDate,

    avatar: profile.avatar ?? "",

    institution: profile.institution,
    course: profile.course,
    semester: profile.semester,
    graduationYear: profile.graduationYear,

    about: profile.about,

    interests: profile.interests ?? [],

    experiences: profile.experiences ?? [],

    availability: profile.availability,

    remote: profile.remote,

    notifications: profile.notifications,

    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  };
}

export function profileFormToRequest(
  data: ProfileFormData,
) {
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

    experiences: data.experiences,

    availability: data.availability,

    remote: data.remote,

    notifications: data.notifications,
  };
}