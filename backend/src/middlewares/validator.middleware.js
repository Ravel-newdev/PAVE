/**
 * @file validator.middleware.js
 * @description Middleware genérico de barreira estrutural utilizando Zod.
 * Garante que o fluxo de execução só atinja os controladores se o payload da
 * requisição estiver em conformidade estrita com o esquema esperado pelo módulo.
 */

const validate = (schema) => {
  return async (req, res, next) => {
    try {
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = validate;