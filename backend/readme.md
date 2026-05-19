# Construção do backend
A construção do back-end do projeto inclui as rotas de autenticação, segurança, conexão com o banco de dados, requisições de valores sensíveis. O back-end não depende das rotas do front-end.

Assumiremos um prefixo `pave.com/api/` ao trabalharmos com alguma rota do backend, para distinção.
# README

## Funcionalidades do Backend

---

# Discente

## Projetos
- Rotas para listar e buscar projetos [definir paginação]
- Para o aluno, listar projetos com pesquisa por tema e outros filtros relevantes
- GET com um JSON com descrições de um projeto específico, baseado em ID
- Listar o conjunto de projetos de um discente específico (é possível integrar em uma única rota com o listar e buscar projetos para otimizar a busca)

## Inscrições
- Rotas para inscrição por parte do discente
- As inscrições possuem estados de avaliação [pendente, selecionado, eliminado]

## Notificações
- Notificações por email
- Rotas para registrar notificações no banco de dados, adicionar get e exclusão de notificações

---

# Docente

## Projetos
- Estabelecer rotas para criação de projetos, edição e deletar
- Projetos listam informações do docente no JSON, definir acesso rápido e descrição conforme a tabela de docente

## Processo Seletivo
- Rotas para configuração das etapas por parte do docente em relação aos alunos interessados em participar de um projeto específico. O professor tem autonomia para mover alunos em processo seletivo, eliminar, aprovar e obter informações de um aluno.
- Editar configurações de processo seletivo
- Sistema de pontuação opcional por etapa de processo seletivo; o docente pode ou não adicionar uma valoração para determinado candidato com base no desempenho dele na etapa.

## Histórico
- Definir rotas no banco de dados para histórico de atividades do docente

---

# Sistema

## Autenticação
- Rotas para autenticação
- Definir nível de autenticação no JWT (se é usuário comum ou docente)
- Acrescentar administrador ao banco de dados e implementar no backend

## Segurança
- Criptografar envio de documentos e informações pessoais usando bcrypt ou algum hash

## Estatísticas
- Acrescentar tabela de estatística ao banco de dados
- Por exemplo, os projetos com mais inscrições, mas a ideia é que exista um grupo de subtabela com dados estatísticos de acesso rápido

## Performance
- Controle de requisição com Redis

## Testes
- Testes no Postman das rotas

## Dependências
O projeto tem um conjunto de dependências, para compreender como o backend está em pleno funcionamento, é bom destacar.

### Cors
É um mecanismo de segurança implementado pelos navegadores que bloqueia requisições feitas de uma origem para outra, a menos que o servidor destino explicitamente permita.

Origem é a combinação de protocolo, domínio e porta. No caso do PAVE:

Frontend React: http://localhost:5173  
Backend Express: http://localhost:3000

São origens distintas. Sem o cors configurado no backend, o navegador bloqueia qualquer requisição do React para a API, mesmo que ambos estejam rodando localmente. O erro aparece no console do navegador, não no servidor.  
O cors resolve isso adicionando os cabeçalhos HTTP apropriados nas respostas.

### Express
Framework para criação do servidor HTTP e definição de rotas.

### pg
Driver de conexão com o PostgreSQL, com suporte a pool de conexões.

### dotenv
Carrega variáveis de ambiente a partir do arquivo `.env`.

### jsonwebtoken
Implementa autenticação baseada em JWT.

### bcrypt
Responsável pelo hash de senhas e verificação segura.

## Rotas
As rotas de autenticação e protocolos de segurança estão definidos aqui. Ainda em construção.

## Banco de dados
A configuração de conexões do banco de dados ocorre no arquivo `src/database/connection.js`, os arquivos puxam as conexões de lá por meio da uma pool de conexões. Para cada conexão aberta, deve ser finalizada ao fim das transações e devolvidas para a pool.

## Controle de requisição
É um requisito futuro o controle de requisição por IP, provavelmente usando Redis ou algum banco de dados no-sql para evitar sobrecarga ou brute force.
