import type { Control } from "react-hook-form";
import type { ProfileFormData } from "@/types/perfilAluno";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "../ui/card";

import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../ui/form";

import { Textarea } from "../ui/textarea";

interface Props {
    control: Control<ProfileFormData>;
}

export function AboutCard({
    control,
}: Props) {
    return (
        <Card>

            <CardHeader>
                <CardTitle>
                    Sobre você
                </CardTitle>
            </CardHeader>

            <CardContent>

                <FormField
                    control={control}
                    name="about"
                    render={({ field }) => (
                        <FormItem>

                            <FormLabel>
                                Conte um pouco sobre sua trajetória acadêmica e profissional
                            </FormLabel>

                            <FormControl>
                                <Textarea
                                    {...field}
                                    rows={7}
                                    placeholder="Escreva uma breve apresentação..."
                                    className="resize-none"
                                />
                            </FormControl>

                            <FormMessage />

                        </FormItem>
                    )}
                />

            </CardContent>

        </Card>
    );
}