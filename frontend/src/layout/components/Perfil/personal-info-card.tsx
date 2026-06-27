import type { Control } from "react-hook-form";
import { useWatch } from "react-hook-form";
import type { ProfileFormData } from "@/types/perfilAluno";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { AvatarUpload } from "./avatar-upload";

interface Props {
    control: Control<ProfileFormData>;
    avatar?: string;
    avatarUploading?: boolean;
    onAvatarChange(file: File): void;
}

export function PersonalInfoCard({
    control,
    avatar,
    avatarUploading = false,
    onAvatarChange,
}: Props) {
    const firstName = useWatch({ control, name: "firstName" });
    const lastName  = useWatch({ control, name: "lastName" });

    const initials = [firstName, lastName]
        .map((n) => n?.trim().charAt(0).toUpperCase())
        .filter(Boolean)
        .join("") || "?";

    return (
        <Card>
            <CardHeader>
                <CardTitle>Informações pessoais</CardTitle>
            </CardHeader>

            <CardContent className="space-y-8">

                <AvatarUpload
                    image={avatar}
                    initials={initials}
                    uploading={avatarUploading}
                    onChange={onAvatarChange}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    <FormField
                        control={control}
                        name="firstName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nome</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={control}
                        name="lastName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Sobrenome</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>E-mail</FormLabel>
                                <FormControl>
                                    <Input type="email" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={control}
                        name="phone"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Telefone</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={control}
                        name="birthDate"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Data de nascimento</FormLabel>
                                <FormControl>
                                    <Input type="date" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                </div>

            </CardContent>
        </Card>
    );
}
