# Construção do backend
A construção do back-end do projeto inclui as rotas de autenticação, segurança, conexão com o banco de dados, requisições de valores sensíveis. O back-end não depende das rotas do front-end.

Assumiremos um prefixo `pave.com/api/` ao trabalharmos com alguma rota do backend, para distinção.

## Dependências
O projeto tem um conjunto de dependências, para compreender como o backend está em pleno funcionamento, é bom destacar.

### Cors
É um mecanismo de segurança implementado pelos navegadores que bloqueia requisições feitas de uma origem para outra, a menos que o servidor destino explicitamente permita.

Origem é a combinação de protocolo, domínio e porta. No caso do PAVE:

Frontend React: http://localhost:5173
Backend Express: http://localhost:3000

São origens distintas. Sem o cors configurado no backend, o navegador bloqueia qualquer requisição do React para a API, mesmo que ambos estejam rodando localmente. O erro aparece no console do navegador, não no servidor.
O cors, junto com o express resolvem isso adicionando os cabeçalhos HTTP apropriados nas respostas, sinalizando ao navegador quais origens têm permissão de consumir a API.

## Rotas
As rotas de autenticação e protocolos de segurança estão definidos aqui. Ainda em construção.

## Banco de dados
A configuração de conexões do banco de dados ocorre no arquivo `src/database/connection.js`, os arquivos puxam as conexões de lá por meio da uma pool de conexões. Para cada conexão aberta, deve ser finalizada ao fim das transações e devolvidas para a pool.

## Controle de requisição
É um requisito futuro o controle de requisição por IP, provavelmente usando Redis ou algum banco de dados no-sql para evitar sobrecarga ou brute force.