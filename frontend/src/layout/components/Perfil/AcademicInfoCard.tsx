import type { Control } from "react-hook-form";
import type { ProfileFormData } from "@/types/perfilAluno";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";

interface Props {
    control: Control<ProfileFormData>;
}

export function AcademicInfoCard({ control }: Props) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Informações acadêmicas</CardTitle>
            </CardHeader>

            <CardContent className="grid md:grid-cols-2 gap-6">
                <FormField
                    control={control}
                    name="course"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Curso</FormLabel>
                            <FormControl><Input {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={control}
                    name="semester"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Semestre</FormLabel>
                            <FormControl><Input {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </CardContent>
        </Card>
    );
}
