/**
 * @file auth.middleware.js
 * @description Interceptadores de segurança para controle de sessões e privilégios.
 * Isola a extração de dados de identidade contidos no JWT e restringe o acesso aos
 * endpoints com base nos níveis contidos no ENUM de usuários.
 */

const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config/env");

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Token de autenticação não fornecido ou mal formatado.");
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded;
    next();
  } catch (error) {
    throw new Error("Token inválido ou expirado.");
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.tipo)) {
      throw new Error("Acesso negado.");
    }
    next();
  };
};

module.exports = { authenticate, authorize };