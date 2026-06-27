# Resumo das mudanças da sprint

## Contexto geral

Basicamente o sistema existia visualmente mas quase sem integração real com o backend. Boa parte das páginas usava dados mockados, campos ignorados ou endpoints inexistentes. O trabalho desta sprint foi ligar tudo de verdade.

---

## O que foi feito

### Rota de candidatura quebrada

A página de candidatura simplesmente não abria — dava 404. O problema era estrutural no roteamento: a rota pai `/aluno` renderizava diretamente o componente em vez de passar o fluxo para os filhos. Corrigido o layout de rotas para que `/aluno/candidatura` funcione como uma rota filha de verdade.

### Formulário de candidatura integrado com o backend

O formulário existia mas era essencialmente estático. Integramos tudo:

- Os **campos do formulário** agora vêm do banco, via processo seletivo → formulário → campos. Cada projeto pode ter um formulário diferente com perguntas específicas.
- **Arquivos** (currículo, histórico, etc.) são enviados para o R2 (Cloudflare) antes de submeter a candidatura.
- A **inscrição** é criada no banco com todas as respostas vinculadas aos campos corretos.

Antes disso, o formulário não fazia nenhuma dessas coisas — era só UI.

### Matrícula e curso sumindo no formulário

O formulário de candidatura precisa exibir nome, matrícula e curso do aluno, mas o JWT só carrega o ID e o tipo do usuário. Criamos um endpoint `GET /api/discentes/me` que retorna os dados do perfil, e o formulário agora busca esses dados ao abrir.

### Vagas dos projetos não apareciam

Os cards de projeto sempre mostravam "Sem vagas informadas" mesmo quando o processo seletivo tinha vagas definidas. O problema era que a listagem de projetos não buscava essa informação — ela fica em outra tabela (processo seletivo). Adicionamos uma subconsulta que puxa as vagas do processo mais recente em aberto de cada projeto.

### UUIDs inválidos quebravam a submissão

Ao tentar enviar o formulário de candidatura, o backend rejeitava com erro de validação. O motivo foi o Zod v4, que passou a validar o formato UUID de acordo com o RFC 4122 de forma estrita — os IDs usados nos dados de teste tinham zeros nas posições de versão e variante, o que tecnicamente não é um UUID válido. Corrigimos todos os IDs do banco de dados de teste para seguir o padrão correto.

### Campos do formulário sem identificador semântico

O backend retornava os campos do formulário com tipo, label e ordem, mas sem um identificador que dissesse "este campo é o currículo". Adicionamos o `chave_unica` na resposta, que é um slug fixo definido no cadastro do tipo de campo (ex: `curriculo`, `carta_motivacao`). Isso permite que o frontend identifique campos específicos sem depender de texto livre.

### Perfil do discente sem estrutura no banco

A tabela de discentes tinha só os dados básicos do cadastro (nome, matrícula, curso). A página de perfil existia no frontend mas chamava endpoints que não existiam em lugar nenhum. Adicionamos as colunas de perfil — foto, currículo, bio, semestre, LinkedIn, disponibilidade, preferência por remoto, interesses — e criamos os endpoints reais para ler e atualizar essas informações, além de upload de foto e currículo para o R2.

### Currículo pré-preenchido na candidatura

Com o perfil funcionando, conectamos as duas pontas: se o discente já tem um currículo salvo no perfil, ele aparece automaticamente preenchido no campo de currículo da candidatura. O aluno pode substituir por outro arquivo se preferir, mas não precisa reanexar toda vez que for se candidatar.

---

## Por que demorou tanto

O sistema estava em camadas desconexas — frontend com mocks, backend com tabelas incompletas, e alguns endpoints faltando. Não dava para ajustar uma coisa sem quebrar a dependência da outra, então o trabalho acabou sendo uma integração em cadeia: banco → backend → frontend, de ponta a ponta.
