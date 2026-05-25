# Documentação de Rotas da API

Este documento detalha os endpoints disponíveis, métodos HTTP, parâmetros esperados e regras de autorização para o consumo da API.

---

### AUTH

**POST /api/auth/register/discente**
* **Descrição:** Registra um novo usuário com perfil discente.
* **Autorização:** Pública.
* **Corpo da Requisição (JSON):**
    ```json
    {
      "matricula": "string",
      "nome": "string",
      "email": "string",
      "senha": "string",
      "telefone": "string (opcional)",
      "curso": "string (opcional)"
    }
    ```

**POST /api/auth/register/docente**
* **Descrição:** Registra um novo usuário com perfil docente.
* **Autorização:** Pública.
* **Corpo da Requisição (JSON):**
    ```json
    {
      "matricula": "string",
      "nome": "string",
      "email": "string",
      "senha": "string",
      "telefone": "string (opcional)",
      "departamento": "string (opcional)"
    }
    ```

**POST /api/auth/login**
* **Descrição:** Autentica um usuário e retorna o token JWT.
* **Autorização:** Pública.
* **Corpo da Requisição (JSON):**
    ```json
    {
      "email": "string",
      "senha": "string"
    }
    ```

**POST /api/auth/recuperar-senha**
* **Descrição:** Solicita o envio de token para redefinição de senha.
* **Autorização:** Pública.
* **Corpo da Requisição (JSON):**
    ```json
    {
      "email": "string"
    }
    ```

**POST /api/auth/reset-senha**
* **Descrição:** Consome o token de redefinição para alterar a senha.
* **Autorização:** Pública.
* **Corpo da Requisição (JSON):**
    ```json
    {
      "token": "string",
      "nova_senha": "string"
    }
    ```

---

### PROJETOS

**GET /api/projetos**
* **Descrição:** Retorna a listagem de projetos. Oculta os projetos com status `rascunho` para requisições autenticadas por discentes.
* **Autorização:** Autenticado (Docente ou Discente).
* **Query Params:** `?status=string` (opcional).
* **Corpo da Requisição:** Nenhum.

**GET /api/projetos/:id**
* **Descrição:** Retorna os detalhes de um projeto específico, incluindo o nome do autor e array de tags.
* **Autorização:** Autenticado.
* **Corpo da Requisição:** Nenhum.

**POST /api/projetos**
* **Descrição:** Cria um novo projeto.
* **Autorização:** Restrito a Docente.
* **Corpo da Requisição (JSON):**
    ```json
    {
      "titulo": "string",
      "descricao": "string (opcional)",
      "carga_hora": "number (inteiro, opcional)",
      "data_inic": "string ISO 8601 YYYY-MM-DD (opcional)",
      "data_termino": "string ISO 8601 YYYY-MM-DD (opcional)",
      "centro_dep": "string (opcional)",
      "tags": ["uuid", "uuid"] // Array de strings em formato UUID (opcional)
    }
    ```

**PUT /api/projetos/:id**
* **Descrição:** Atualiza os dados de um projeto. Permite envio parcial dos campos.
* **Autorização:** Restrito ao Docente autor do projeto.
* **Corpo da Requisição (JSON):** Mesmo formato do método POST, com todos os campos sendo opcionais.

**PATCH /api/projetos/:id/status**
* **Descrição:** Altera o status na máquina de estados do projeto.
* **Autorização:** Restrito ao Docente autor do projeto.
* **Corpo da Requisição (JSON):**
    ```json
    {
      "status": "string ('rascunho' | 'ativo' | 'encerrado' | 'suspenso')"
    }
    ```

**POST /api/projetos/:id/favorito**
* **Descrição:** Alterna o estado de favorito de um projeto (favoritar/desfavoritar).
* **Autorização:** Restrito a Discente.
* **Corpo da Requisição:** Nenhum.

---

### PROCESSOS SELETIVOS

**POST /api/processos**
* **Descrição:** Cria um edital/processo seletivo vinculado a um projeto ativo.
* **Autorização:** Restrito ao Docente autor do projeto vinculado.
* **Corpo da Requisição (JSON):**
    ```json
    {
      "projeto_id": "uuid",
      "formulario_id": "uuid (opcional)",
      "titulo": "string",
      "descricao": "string (opcional)",
      "data_inicio": "string ISO 8601 YYYY-MM-DD (opcional)",
      "data_termino": "string ISO 8601 YYYY-MM-DD (opcional)",
      "pdf_edital": "string formato URL (opcional)",
      "n_vagas": "number (inteiro, opcional)"
    }
    ```

**PUT /api/processos/:id**
* **Descrição:** Atualiza os dados do processo seletivo.
* **Autorização:** Restrito ao Docente autor do projeto original.
* **Corpo da Requisição (JSON):** Mesmo formato do POST, permitindo envio parcial e aceitando o campo adicional opcional `"status": "string ('aberto' | 'encerrado' | 'cancelado')"`.

**GET /api/processos/:id/candidatos**
* **Descrição:** Lista todos os candidatos inscritos em um edital específico.
* **Autorização:** Restrito ao Docente autor do projeto.
* **Corpo da Requisição:** Nenhum.

**PATCH /api/processos/:id/candidatos/:inscricaoId**
* **Descrição:** Rota auxiliar de gestão de processo seletivo para alterar informações posicionais ou metadados de uma inscrição (se implementada separadamente da avaliação).
* **Autorização:** Restrito ao Docente autor do projeto.
* **Corpo da Requisição (JSON):** Depende do escopo implementado (ex.: atualização exclusiva da coluna Kanban).

---

### INSCRIÇÕES

**POST /api/inscricoes**
* **Descrição:** Registra a inscrição de um discente em um processo seletivo, gravando as respostas de formulário caso existam.
* **Autorização:** Restrito a Discente.
* **Corpo da Requisição (JSON):**
    ```json
    {
      "ps_id": "uuid",
      "respostas": [
        {
          "campo_id": "uuid",
          "valor_texto": "string (opcional)",
          "arquivo_url": "string formato URL (opcional)"
        }
      ] // Array de respostas é opcional. Pelo menos valor_texto ou arquivo_url deve estar presente em cada objeto.
    }
    ```

**GET /api/inscricoes**
* **Descrição:** Lista o histórico de todas as inscrições efetuadas pelo discente requisitante.
* **Autorização:** Restrito a Discente.
* **Corpo da Requisição:** Nenhum.

**GET /api/inscricoes/:id**
* **Descrição:** Retorna os detalhes e as respostas enviadas de uma inscrição específica.
* **Autorização:** Restrito ao Discente dono da inscrição ou ao Docente autor do projeto.
* **Corpo da Requisição:** Nenhum.

**POST /api/inscricoes/:id/avaliar**
* **Descrição:** Rota para atribuição de notas e transição de status do candidato.
* **Autorização:** Restrito ao Docente autor do projeto.
* **Corpo da Requisição (JSON):**
    ```json
    {
      "nota": "number (entre 0 e 10, opcional)",
      "comentario": "string (opcional)",
      "novo_status": "string ('em_analise' | 'aprovado' | 'reprovado' | 'desistencia')",
      "coluna_kanban": "number (inteiro positivo, opcional)"
    }
    ```

---

### NOTIFICAÇÕES

**GET /api/notificacoes**
* **Descrição:** Lista as notificações direcionadas ao usuário requisitante.
* **Autorização:** Autenticado.
* **Corpo da Requisição:** Nenhum.

**PATCH /api/notificacoes/:id/lida**
* **Descrição:** Altera o status da notificação para lida.
* **Autorização:** Autenticado (Proprietário da notificação).
* **Corpo da Requisição:** Nenhum.

**DELETE /api/notificacoes/:id**
* **Descrição:** Exclui permanentemente a notificação.
* **Autorização:** Autenticado (Proprietário da notificação).
* **Corpo da Requisição:** Nenhum.

---

### METADADOS E FILTROS

**GET /api/tags**
* **Descrição:** Retorna a listagem estática de tags disponíveis no sistema.
* **Autorização:** Autenticado.
* **Corpo da Requisição:** Nenhum.

**GET /api/formularios/tipos-campo**
* **Descrição:** Retorna a listagem dos tipos de campos permitidos para a construção de formulários.
* **Autorização:** Autenticado.
* **Corpo da Requisição:** Nenhum.

**GET /api/discentes/favoritos**
* **Descrição:** Retorna os dados completos dos projetos que o discente logado favoritou.
* **Autorização:** Restrito a Discente.
* **Corpo da Requisição:** Nenhum.