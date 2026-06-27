# Rotas da API — Resumo

## Auth
- `POST /api/auth/register/discente` — Registra discente
- `POST /api/auth/register/docente` — Registra docente
- `POST /api/auth/login` — Login, retorna JWT
- `POST /api/auth/recuperar-senha` — Solicita redefinição de senha por e-mail
- `POST /api/auth/reset-senha` — Redefine a senha com o token recebido

## Projetos
- `GET /api/projetos` — Lista projetos (rascunhos ocultos para discentes)
- `GET /api/projetos/:id` — Detalhes de um projeto
- `POST /api/projetos` — Cria projeto (docente)
- `PUT /api/projetos/:id` — Atualiza projeto (docente dono)
- `PATCH /api/projetos/:id/status` — Altera status do projeto
- `POST /api/projetos/:id/favorito` — Favorita/desfavorita projeto (discente)

## Processos Seletivos
- `POST /api/processos` — Cria processo seletivo vinculado a um projeto
- `PUT /api/processos/:id` — Atualiza processo seletivo
- `GET /api/processos/:id` — Detalhes de um processo seletivo
- `GET /api/processos/projeto/:projetoId` — Lista processos abertos de um projeto

## Candidatos / Kanban
- `GET /api/processos/:id/candidatos` — Lista candidatos de um processo
- `PATCH /api/processos/:id/candidatos/:inscricaoId` — Atualiza posição/metadados de uma inscrição no kanban

## Inscrições
- `POST /api/inscricoes` — Cria inscrição com respostas do formulário (discente)
- `GET /api/inscricoes` — Lista inscrições do discente autenticado
- `GET /api/inscricoes/:id` — Detalhes de uma inscrição
- `POST /api/inscricoes/:id/avaliar` — Avalia inscrição com nota e status (docente)

## Notificações
- `GET /api/notificacoes` — Lista notificações do usuário autenticado
- `PATCH /api/notificacoes/:id/lida` — Marca notificação como lida
- `DELETE /api/notificacoes/:id` — Exclui notificação

## Formulários
- `GET /api/tags` — Lista tags disponíveis
- `GET /api/formularios/tipos-campo` — Lista tipos de campo permitidos
- `GET /api/formularios/:id/campos` — Lista campos de um formulário

## Uploads
- `POST /api/uploads/candidatura?processoId=&campoId=` — Upload de arquivo para candidatura (PDF, máx. 10 MB)

## Discentes
- `GET /api/discentes/me` — Perfil completo do discente autenticado
- `PUT /api/discentes/me` — Atualiza perfil do discente
- `POST /api/discentes/me/foto` — Upload de foto de perfil (JPEG/PNG/WebP, máx. 5 MB)
- `POST /api/discentes/me/curriculo` — Upload de currículo (PDF, máx. 10 MB)
- `GET /api/discentes/favoritos` — Lista projetos favoritados pelo discente
