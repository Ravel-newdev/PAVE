# PAVE — Plataforma de Voluntariado e Extensão

> Projeto desenvolvido para a disciplina de Engenharia de Software — Universidade Federal do Ceará (UFC)

O PAVE é uma plataforma web que centraliza os projetos de extensão da UFC, conectando alunos voluntários a professores que buscam colaboradores. O sistema padroniza os processos de inscrição e seleção de candidatos, amplia a transparência na comunicação e otimiza a gestão de vagas não contempladas por sistemas como o SIGAA.

---

## 👥 Equipe

| Nome | Cargo | GitHub |
|---|---|---|
| Felipe Gabriel | DevOps e Desenvolvedor Back-end | [@FelipeGabriel05](https://github.com/FelipeGabriel05) |
| Marcos Vinicius | Tech Lead e Desenvolvedor Back-end | [@vinicius-paraujo](https://github.com/vinicius-paraujo) |
| Raissa Costa | Analista de Requisitos e Desenvolvedora Front-end | [@RaissaSousaa](https://github.com/RaissaSousaa) |
| Ravel Costa | DBA e Desenvolvedor Back-end | [@Ravel-newdev](https://github.com/Ravel-newdev) |
| Ravena Marques | Analista de Testes (QA) e Desenvolvedora Front-end | [@ravenacarvalho](https://github.com/ravenacarvalho) |
| Yasmin Santos | Gerente de Projeto e Desenvolvedora Front-end | [@MinAmorim](https://github.com/MinAmorim) |

---

## 🗂️ Estrutura do Repositório

```
PAVE/
├── backend/       # API REST em Node.js + Express
├── frontend/      # Interface web em React (TanStack Start)
└── diagrama/      # Diagramas UML e DER do sistema
```

---

## 🛠️ Stack

| Camada | Tecnologia |
|---|---|
| Front-end | React, TanStack Start, TanStack Router, Tailwind CSS |
| Back-end | Node.js, Express |
| Banco de dados | PostgreSQL |
| Autenticação | JWT (jsonwebtoken) + bcrypt |
| Linting/Format | Biome |
| Testes (back) | Postman |
| Testes (front) | Vitest |

---

## ⚙️ Como rodar localmente

### Pré-requisitos

- Node.js 18+
- PostgreSQL rodando localmente
- npm ou pnpm

### Back-end

```bash
cd backend
npm install
```

Crie um arquivo `.env` na raiz do `backend/` com as seguintes variáveis:

```env
PORT=3000
DATABASE_URL=postgresql://usuario:senha@localhost:5432/pave
JWT_SECRET=sua_chave_secreta
FRONTEND_URL=http://localhost:5173
```

Execute o script SQL para criar as tabelas:

```bash
psql -U usuario -d pave -f diagrama/pave_schema.sql
```

Inicie o servidor:

```bash
npm run dev
```

O servidor estará disponível em `http://localhost:3000`. Todas as rotas da API utilizam o prefixo `/api`.

### Front-end

```bash
cd frontend
pnpm install
pnpm dev
```

A aplicação estará disponível em `http://localhost:5173`.

---

## 🗃️ Banco de Dados

O schema completo está em `diagrama/pave_schema.sql`. As tabelas principais são:

| Tabela | Descrição |
|---|---|
| `docentes` | Professores cadastrados no sistema |
| `discentes` | Alunos cadastrados no sistema |
| `projetos` | Projetos de extensão criados pelos docentes |
| `processo_seletivo` | Processos seletivos vinculados a projetos |
| `formulario` | Formulário de inscrição de cada processo seletivo |
| `tipo_campo` | Catálogo fixo de tipos de campo disponíveis (currículo, histórico, etc.) |
| `campo_formulario` | Campos ativados pelo docente via checklist ao configurar o formulário |
| `inscricao` | Candidaturas de discentes em processos seletivos |
| `resposta_formulario` | Respostas enviadas por cada candidato |
| `avaliacao` | Avaliações dos docentes sobre cada candidato |
| `certificado` | Certificados emitidos para inscrições aprovadas |
| `notificacao` | Notificações do sistema para docentes e discentes |
| `tag` | Tags de categorização dos projetos |

### Conexão com o banco

A configuração da pool de conexões está em `src/database/connection.js`. O módulo exporta três elementos:

- **`connectDatabase()`** — estabelece a conexão inicial; o servidor só sobe após ela ser bem-sucedida.
- **`query(text, params)`** — executa uma query avulsa; a conexão é retirada da pool e devolvida automaticamente ao fim.
- **`getClient()`** — retorna um client manual para uso em transações. É obrigatório chamar `client.release()` no bloco `finally`.

```js
// query simples
const { query } = require("./database/connection");
const { rows } = await query("SELECT * FROM projetos WHERE id = $1", [id]);

// transação
const { getClient } = require("./database/connection");
const client = await getClient();
try {
  await client.query("BEGIN");
  await client.query("INSERT INTO processo_seletivo ...");
  await client.query("UPDATE formulario SET id_ps = $1 ...", [id]);
  await client.query("COMMIT");
} catch (err) {
  await client.query("ROLLBACK");
  throw err;
} finally {
  client.release();
}
```

---

## 🔌 Back-end

### Dependências

| Pacote | Função |
|---|---|
| `express` | Framework HTTP e definição de rotas |
| `pg` | Driver PostgreSQL com suporte a pool de conexões |
| `dotenv` | Carrega variáveis de ambiente do arquivo `.env` |
| `jsonwebtoken` | Autenticação baseada em JWT |
| `bcrypt` | Hash e verificação segura de senhas |
| `cors` | Permite requisições cross-origin do front-end React |

### CORS

O front-end React (`http://localhost:5173`) e o back-end Express (`http://localhost:3000`) são origens distintas. Sem CORS configurado, o navegador bloqueia todas as requisições entre eles. O erro aparece no console do navegador, não no servidor. O middleware `cors` resolve isso adicionando os cabeçalhos HTTP apropriados nas respostas.

### Estrutura de pastas

```
backend/
├── src/
│   ├── config/
│   │   └── env.js              # Centraliza leitura das variáveis de ambiente
│   ├── database/
│   │   └── connection.js       # Pool de conexões PostgreSQL
│   ├── modules/
│   │   └── auth/               # Lógica de autenticação (JWT + bcrypt)
│   └── routes/
│       └── index.js            # Roteador central — prefixo /api
└── index.js                    # Entry point do servidor
```

### Autenticação

O sistema utiliza JWT para autenticação. O token carrega o nível de acesso do usuário (`discente` ou `docente`), verificado por um middleware nas rotas protegidas. As senhas são armazenadas com hash via bcrypt — nunca em texto puro.

### Rotas planejadas

#### Autenticação (`/api/auth`)
| Método | Rota | Descrição |
|---|---|---|
| POST | `/api/auth/cadastro` | Cadastro de discente ou docente |
| POST | `/api/auth/login` | Login e geração do JWT |
| POST | `/api/auth/logout` | Encerramento de sessão |
| POST | `/api/auth/recuperar-senha` | Solicitação de redefinição de senha por e-mail |

#### Projetos (`/api/projetos`)
| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/projetos` | Lista projetos ativos com filtros (tema, palavras-chave) |
| GET | `/api/projetos/:id` | Detalhes de um projeto específico |
| POST | `/api/projetos` | Criação de projeto (docente) |
| PUT | `/api/projetos/:id` | Edição de projeto (docente) |
| PATCH | `/api/projetos/:id/status` | Ativar ou desativar projeto (docente) |

#### Processo Seletivo (`/api/processos`)
| Método | Rota | Descrição |
|---|---|---|
| POST | `/api/processos` | Criação de processo seletivo vinculado a um projeto |
| PUT | `/api/processos/:id` | Edição de configurações do processo |
| GET | `/api/processos/:id/candidatos` | Lista candidatos inscritos |
| PATCH | `/api/processos/:id/candidatos/:inscricaoId` | Move candidato no Kanban / aprova / rejeita |

#### Inscrições (`/api/inscricoes`)
| Método | Rota | Descrição |
|---|---|---|
| POST | `/api/inscricoes` | Discente se inscreve em um processo seletivo |
| GET | `/api/inscricoes` | Lista inscrições do discente autenticado |
| GET | `/api/inscricoes/:id` | Detalhes de uma inscrição |

#### Notificações (`/api/notificacoes`)
| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/notificacoes` | Lista notificações do usuário autenticado |
| PATCH | `/api/notificacoes/:id/lida` | Marca notificação como lida |
| DELETE | `/api/notificacoes/:id` | Remove uma notificação |

---

## 🎨 Front-end

### Dependências

| Pacote | Função |
|---|---|
| `TanStack Start` | Framework React com SSR e server functions |
| `TanStack Router` | Roteamento file-based com suporte a loaders |
| `Tailwind CSS` | Estilização utilitária |
| `Biome` | Linting e formatação de código |
| `Vitest` | Testes unitários |

### Scripts disponíveis

```bash
pnpm dev       # Inicia o servidor de desenvolvimento
pnpm build     # Build de produção
pnpm test      # Executa os testes com Vitest
pnpm lint      # Lint com Biome
pnpm format    # Formata o código com Biome
pnpm check     # Lint + format juntos
```

### Telas planejadas

| Tela | Descrição |
|---|---|
| Home | Catálogo público de projetos ativos com filtros de busca |
| Login / Cadastro | Autenticação de discentes e docentes |
| Detalhes do Projeto | Informações completas de um projeto e botão de inscrição |
| Tela de Inscrição | Formulário de candidatura configurado pelo docente |
| Dashboard do Aluno | Inscrições ativas, projetos favoritados e notificações |
| Dashboard do Docente | Projetos criados e processos seletivos em andamento |
| Criação de Formulário | Checklist para o docente configurar os campos do processo seletivo |
| Lista de Inscritos | Painel Kanban com candidatos do processo seletivo |
| Visualização do Inscrito | Dados e documentos enviados por um candidato específico |

---

## 📋 Requisitos Funcionais

| ID | Nome | Descrição |
|---|---|---|
| RF01 | Cadastro de usuário | Permite cadastro de alunos e professores com nome, e-mail institucional e senha |
| RF02 | Login | Autenticação com e-mail e senha |
| RF03 | Logout | Encerramento de sessão |
| RF04 | Recuperação de senha | Redefinição de senha via link enviado por e-mail |
| RF05 | Edição de perfil | Usuários podem editar suas informações pessoais |
| RF06 | Cadastro de projeto | Professores cadastram projetos de extensão |
| RF07 | Edição de projeto | Professor edita seus próprios projetos |
| RF08 | Desativação de projeto | Professor desativa seus próprios projetos |
| RF09 | Criação de processo seletivo | Professor cria processo seletivo vinculado a um projeto |
| RF10 | Listagem de projetos | Catálogo com filtros por área temática, tipo de vaga e palavras-chave |
| RF11 | Candidatura | Aluno se inscreve em processo seletivo e envia documentos solicitados |
| RF12 | Acompanhamento de inscrições | Aluno visualiza o status de todas as suas candidaturas |
| RF13 | Favoritar projetos | Aluno marca projetos como favoritos para acesso rápido |
| RF14 | Dashboard do aluno | Painel com inscrições ativas, favoritos e notificações recentes |
| RF15 | Visualização de candidatos | Professor visualiza lista de inscritos com dados de cada candidato |
| RF16 | Aprovação de candidatos | Professor aprova candidatos via painel Kanban |
| RF17 | Rejeição de candidatos | Professor rejeita candidatos |
| RF18 | Notificações | Alertas sobre inscrições, resultados e novas oportunidades |
| RF19 | Sugestão de projetos | Alunos sugerem ideias de projetos visíveis a professores em nuvem de palavras |
| RF20 | Listagem de projetos do professor | Painel do docente com todos os seus projetos e processos seletivos |

---

## 🔒 Segurança

- Senhas armazenadas com hash via **bcrypt** — nunca em texto puro
- Autenticação via **JWT** com nível de acesso (`discente` / `docente`) embutido no token
- Documentos e informações sensíveis criptografados no envio
- **Controle de requisições por IP** planejado com Redis para prevenção de brute force e sobrecarga (requisito futuro)

---

## 🗺️ Roadmap

- [x] Modelagem do banco de dados (DER + MER)
- [x] Script DDL PostgreSQL
- [x] Configuração da pool de conexões
- [ ] Rotas de autenticação (cadastro, login, JWT)
- [ ] Rotas de projetos
- [ ] Rotas de processo seletivo e Kanban
- [ ] Rotas de inscrições e formulários
- [ ] Rotas de notificações
- [ ] Emissão automática de certificados
- [ ] Telas do front-end (Figma → React)
- [ ] Testes de rotas no Postman
- [ ] Controle de requisições com Redis
- [ ] Tabelas de estatísticas
- [ ] Deploy

---

> UFC — Departamento de Computação · Engenharia de Software · 2026
