# PAVE — Frontend

Stack: React, TypeScript, TanStack Router, Vite, pnpm

## Arquitetura
- `src/services/PaveApiService.ts` — classe singleton, toda comunicação HTTP passa por aqui
- `src/context/AuthContext.tsx` — sessão, login, logout
- `src/errors/ApiError.ts` — hierarquia de erros (AuthError, ForbiddenError, etc.)
- `src/types/` — tipos alinhados ao backend
- Guards de rota via `beforeLoad` em `src/routes/professor/index.tsx` e `src/routes/aluno/index.tsx`
- Chave canônica do token: `@pave:token`

## Regras
- Sem comentários descritivos nos arquivos
- Comentários apenas onde o código não se explica sozinho
- Sem `console.log` de debug
- Sem mocks hardcoded — dados vêm sempre do PaveApiService
- Não usar `getIdFromUrl` — IDs vêm dos params/search do TanStack Router
- Não reescrever CSS existente sem instrução explícita