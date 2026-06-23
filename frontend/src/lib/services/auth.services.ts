import type { RegisterFormData } from "../pages/cadastro/schema";

import { api } from "./constants";

export async function RegisterService(data: RegisterFormData) {
    const response = await api.post("/api/auth/register/discente", data);
    return response.data;
}
