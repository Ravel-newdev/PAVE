### Rotas

AUTH
POST   /api/auth/register/discente
POST   /api/auth/register/docente
POST   /api/auth/login
POST   /api/auth/recuperar-senha
POST   /api/auth/reset-senha

PROJETOS
GET    /api/projetos
GET    /api/projetos/:id
POST   /api/projetos
PUT    /api/projetos/:id
PATCH  /api/projetos/:id/status
POST   /api/projetos/:id/favorito

PROCESSOS SELETIVOS
POST   /api/processos
PUT    /api/processos/:id
GET    /api/processos/:id/candidatos
PATCH  /api/processos/:id/candidatos/:inscricaoId

INSCRIÇÕES
POST   /api/inscricoes
GET    /api/inscricoes
GET    /api/inscricoes/:id
POST   /api/inscricoes/:id/avaliar

NOTIFICAÇÕES
GET    /api/notificacoes
PATCH  /api/notificacoes/:id/lida
DELETE /api/notificacoes/:id

METADADOS E FILTROS
GET    /api/tags
GET    /api/formularios/tipos-campo
GET    /api/discentes/favoritos