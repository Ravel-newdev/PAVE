import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Form } from "@/layout/components/ui/form";


import { ProfileHeader } from "@/layout/components/Perfil/profile-header";
import { PersonalInfoCard } from "@/layout/components/Perfil/personal-info-card";
import { AcademicInfoCard } from "@/layout/components/Perfil/academic-info-card";
import { AboutCard } from "@/layout/components/Perfil/about-card";
import { InterestSelect } from "@/layout/components/Perfil/interest-select";
import { CurriculoCard } from "@/layout/components/Perfil/experience-card";
import { PreferencesCard } from "@/layout/components/Perfil/preferences-card";
import { SecurityCard } from "@/layout/components/Perfil/security-card";

import { useProfileForm } from "@/hooks/useProfileForm";
import Navbar from "@/layout/components/Navbar/Navbar";

import { getProfile, updateProfile } from "@/services/profile";
import { paveApi } from "@/services/PaveApiService";

import {
  profileFormToRequest,
  profileResponseToForm,
} from "./maper";

import type { ProfileFormData } from "@/types/perfilAluno";

export default function ProfilePage() {
  const form = useProfileForm();

  const {
    control,
    watch,
    reset,
    setValue,
    handleSubmit,
  } = form;

  const [loading, setLoading] = useState(true);

  const avatar = watch("avatar");

  useEffect(() => {
    async function loadProfile() {
      try {
        const { data } = await getProfile();

        reset(profileResponseToForm(data));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [reset]);

  const [avatarUploading, setAvatarUploading] = useState(false);

  async function handleAvatarChange(file: File) {
    setAvatarUploading(true);
    try {
      const { url } = await paveApi.uploadFotoDiscente(file);
      setValue("avatar", url, { shouldDirty: true });
      toast.success("Foto atualizada.");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao enviar a foto.");
    } finally {
      setAvatarUploading(false);
    }
  }

  function onValidationError() {
    toast.error("Corrija os campos destacados antes de salvar.");
  }

  async function onSubmit(data: ProfileFormData) {
    try {
      await updateProfile(profileFormToRequest(data));
      toast.success("Perfil atualizado com sucesso.");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao atualizar perfil. Tente novamente.");
    }
  }

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="container mx-auto py-10">
          Carregando...
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="container mx-auto max-w-7xl py-8 px-6">

        <Form {...form}>

          <form
            onSubmit={handleSubmit(onSubmit, onValidationError)}
            className="space-y-8"
          >

            <ProfileHeader
              onSave={handleSubmit(onSubmit, onValidationError)}
            />

            <PersonalInfoCard
              control={control}
              avatar={avatar ?? ""}
              avatarUploading={avatarUploading}
              onAvatarChange={handleAvatarChange}
            />

            <AcademicInfoCard
              control={control}
            />

            <AboutCard
              control={control}
            />

            <InterestSelect
              control={control}
            />

            <CurriculoCard
              control={control}
            />

            <div className="grid gap-8 lg:grid-cols-2">
                <PreferencesCard control={control}/>
                <SecurityCard control={control}/>
            </div>
          </form>
        </Form>
      </main>
    </>
  );
}