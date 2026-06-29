/**
 * @file error.middleware.js
 * @description Centralizador de tratamento de exceções da aplicação.
 * Desacoplado da infraestrutura, mapeia estritamente mensagens de erro
 * definidas na camada de domínio para seus respectivos códigos HTTP.
 */

const { ZodError } = require("zod");

const errorHandler = (err, req, res, next) => {
  if (err instanceof ZodError || err.name === "ZodError") {
    const issues = err.issues || err.errors || [];
    
    return res.status(400).json({
      message: "Falha na validação dos dados de entrada.",
      errors: issues.map((e) => ({
        campo: e.path.join("."),
        mensagem: e.message,
      })),
    });
  }

  // Interceptação de recursos não encontrados (HTTP 404)
  if (err.message === "Projeto não encontrado.") {
    return res.status(404).json({ message: err.message });
  }

  // Interceptação de falhas de conflito de domínio (HTTP 409)
  const mensagensConflito = [
    "O e-mail informado já está em uso.",
    "A matrícula informada já está cadastrada.",
    "Já existe um projeto cadastrado com este título."
  ];

  if (mensagensConflito.includes(err.message)) {
    return res.status(409).json({ message: err.message });
  }

  // Interceptação de erros de regra de negócio (HTTP 400)
  const mensagensBadRequest = [
    "Senha atual incorreta.",
    "Usuário não encontrado.",
    "Docente não encontrado.",
  ];

  if (mensagensBadRequest.includes(err.message)) {
    return res.status(400).json({ message: err.message });
  }

  // Interceptação de falhas de autenticação (HTTP 401)
  const mensagensNaoAutorizado = [
    "Credenciais inválidas.",
    "Token inválido, expirado ou já utilizado.",
    "Token de autenticação não fornecido ou mal formatado."
  ];

  if (mensagensNaoAutorizado.includes(err.message) || err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
    return res.status(401).json({ message: "Acesso não autorizado. Verifique suas credenciais e o token fornecido." });
  }

  // Interceptação de falhas de autorização (HTTP 403)
  if (err.message === "Acesso negado.") {
    return res.status(403).json({ message: err.message });
  }

  // Erros de sintaxe, infraestrutura ou banco de dados (HTTP 500)
  console.error(`[Erro Sintático/Operacional]: ${err.stack}`);

  res.status(500).json({
    message: "Ocorreu um erro interno no servidor.",
  });
};

module.exports = errorHandler;