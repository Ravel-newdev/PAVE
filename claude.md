# PAVE — Frontend

Stack: React, TypeScript, TanStack Router, Vite, pnpm

## Arquitetura
- `src/services/PaveApiService.ts` — classe singleton, toda comunicação HTTP passa por aqui
- `src/context/AuthContext.tsx` — sessão, login, logout
- `src/errors/ApiError.ts` — hierarquia de erros (AuthError, ForbiddenError, etc.)
- `src/types/` — tipos alinhados ao backend
- Guards de rota via `beforeLoad` em `src/routes/professor/index.tsx` e `src/routes/aluno/index.tsx`
- Chave canônica do token: `@pave:token`

## Estrutura de diretórios
- `src/services/` — camada de comunicação com a API
- `src/context/` — contextos globais (apenas AuthContext)
- `src/errors/` — hierarquia de erros
- `src/hooks/` — hooks customizados
- `src/types/` — contratos de tipos alinhados ao backend
- `src/pages/` — páginas por domínio
- `src/components/` — componentes reutilizáveis
- `src/layout/` — layout global, navbar, footer
- `src/routes/` — árvore de rotas do TanStack Router

## Regras de código
- TypeScript estrito — sem `any`, sem `as unknown` desnecessário
- Sem comentários de cabeçalho nos arquivos
- Sem comentários descrevendo o que o código faz — apenas o porquê, quando não for óbvio
- Sem `console.log` de debug — apenas `console.error` em catch de erros reais
- Sem mocks hardcoded — dados sempre via PaveApiService
- Sem `getIdFromUrl` — IDs vêm de `useParams` ou `useSearch` do TanStack Router
- Não reescrever CSS existente sem instrução explícita
- Não criar arquivos sem instrução explícita
- Erros de API tratados via hierarquia de `ApiError` — nunca inspecionar status code nos componentes

## Padrões de escrita
- Componentes funcionais com tipagem explícita nas props
- Hooks retornam objetos nomeados, não arrays
- Funções assíncronas com `async/await`, nunca `.then()` encadeado em componentes
- Estados de loading e erro sempre explícitos nas páginas que fazem chamadas à API
- Formulários com `react-hook-form` + `zod`
- Imports organizados: externos → internos por camada (types → errors → services → hooks → components)

## Backend
- Base URL: `https://pave-backend-hwck.onrender.com/api`
- Documentação completa dos endpoints: `backend/rotas.md`
- Autenticação: Bearer JWT
- Endpoints documentados em `backend/rotas.md`
- Campos reais do projeto: `id`, `titulo`, `descricao`, `carga_hora`, `data_inic`, `data_termino`, `centro_dep`, `status`, `autor_id`, `autor_nome`, `tags`, `criado_em`
- Status de projeto: `rascunho` | `ativo` | `encerrado` | `suspenso`
- Status de inscrição: `em_analise` | `aprovado` | `reprovado` | `desistencia`
- Tipo de usuário no JWT: `docente` | `discente`

## Antes de qualquer trabalho de integração
- Consultar `backend/rotas.md` para confirmar endpoints, métodos e autorização
- Consultar o schema Zod do módulo correspondente em `backend/src/modules/` para confirmar campos aceitos e retornados

## O que não existe no backend
- `vagasPreenchidas`, `vagasBolsistas`, `vagasVoluntarios`
- `categoria`, `area`, `modalidade`, `turno`
- `coordenador`, `inscricoesAte`
- `objetivos`, `palavrasChave`, `cronograma`, `resumoSelecao`
- Qualquer endpoint de perfil além dos campos básicos do discente