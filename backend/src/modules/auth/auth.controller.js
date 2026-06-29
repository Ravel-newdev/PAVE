/**
 * @file auth.controller.js
 * @description Controlador do fluxo de autenticação e gerenciamento de contas.
 * Alinhado ao Express 5, abdica de blocos try/catch redundantes, delegando
 * as rejeições de Promises diretamente para o middleware de erro global.
 */

const {
  createDiscente,
  createDocente,
  authenticateUser,
  processPasswordRecovery,
  executePasswordReset,
  alterarSenha,
} = require("./auth.service");

const registerDiscente = async (req, res) => {
  const user = await createDiscente(req.body);
  res.status(201).json(user);
};

const registerDocente = async (req, res) => {
  const user = await createDocente(req.body);
  res.status(201).json(user);
};

const login = async (req, res) => {
  const token = await authenticateUser(req.body);
  res.status(200).json({ token });
};

const recoverPassword = async (req, res) => {
  await processPasswordRecovery(req.body.email);
  res.status(200).json({
    message: "Se o e-mail constar em nossa base, as instruções de recuperação serão enviadas em instantes.",
  });
};

const resetPassword = async (req, res) => {
  await executePasswordReset(req.body.token, req.body.novaSenha);
  res.status(200).json({ message: "Senha redefinida com sucesso." });
};

const changePassword = async (req, res) => {
  await alterarSenha(req.user.id, req.body);
  res.status(200).json({ message: "Senha alterada com sucesso." });
};

module.exports = {
  registerDiscente,
  registerDocente,
  login,
  recoverPassword,
  resetPassword,
  changePassword,
};