/**
 * @file auth.service.js
 * @description Serviços de persistência e regras de negócio de credenciais.
 * Centraliza a validação de domínio antecedendo as operações transacionais,
 * garantindo isolamento da infraestrutura.
 */

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { query, getClient } = require("../../database/connection");
const { jwtSecret } = require("../../config/env");
const { sendEmail } = require("../../services/mail.service");
const { recuperacaoSenhaHtml } = require("../../templates/email/recuperacaoSenha");

const SALT_ROUNDS = 12;

const createDiscente = async ({ nome, email, senha, matricula, curso, telefone }) => {
  const emailCheck = await query("SELECT 1 FROM usuarios WHERE email = $1", [email]);
  if (emailCheck.rows.length > 0) {
    throw new Error("O e-mail informado já está em uso.");
  }

  const matriculaCheck = await query("SELECT 1 FROM discentes WHERE matricula = $1", [matricula]);
  if (matriculaCheck.rows.length > 0) {
    throw new Error("A matrícula informada já está cadastrada.");
  }

  const client = await getClient();
  try {
    await client.query("BEGIN");

    const hashedPassword = await bcrypt.hash(senha, SALT_ROUNDS);

    const { rows } = await client.query(
      `INSERT INTO usuarios (email, senha, tipo)
       VALUES ($1, $2, 'discente') RETURNING id`,
      [email, hashedPassword]
    );

    const { id } = rows[0];

    await client.query(
      `INSERT INTO discentes (id, matricula, nome, telefone, curso)
       VALUES ($1, $2, $3, $4, $5)`,
      [id, matricula, nome, telefone, curso]
    );

    await client.query("COMMIT");
    return { nome, email, tipo: "discente" };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

const createDocente = async ({ nome, email, senha, matricula, departamento, telefone }) => {
  const emailCheck = await query("SELECT 1 FROM usuarios WHERE email = $1", [email]);
  if (emailCheck.rows.length > 0) {
    throw new Error("O e-mail informado já está em uso.");
  }

  const matriculaCheck = await query("SELECT 1 FROM docentes WHERE matricula = $1", [matricula]);
  if (matriculaCheck.rows.length > 0) {
    throw new Error("A matrícula informada já está cadastrada.");
  }

  const client = await getClient();
  try {
    await client.query("BEGIN");

    const hashedPassword = await bcrypt.hash(senha, SALT_ROUNDS);

    const { rows } = await client.query(
      `INSERT INTO usuarios (email, senha, tipo)
       VALUES ($1, $2, 'docente') RETURNING id`,
      [email, hashedPassword]
    );

    const { id } = rows[0];

    await client.query(
      `INSERT INTO docentes (id, matricula, nome, telefone, departamento)
       VALUES ($1, $2, $3, $4, $5)`,
      [id, matricula, nome, telefone, departamento]
    );

    await client.query("COMMIT");
    return { nome, email, tipo: "docente" };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

const authenticateUser = async ({ email, senha }) => {
  const { rows } = await query(
    "SELECT id, email, senha, tipo FROM usuarios WHERE email = $1",
    [email]
  );

  const user = rows[0];
  if (!user) throw new Error("Credenciais inválidas.");

  const valid = await bcrypt.compare(senha, user.senha);
  if (!valid) throw new Error("Credenciais inválidas.");

  const tabela = user.tipo === "docente" ? "docentes" : "discentes";
  const { rows: perfil } = await query(`SELECT nome FROM ${tabela} WHERE id = $1`, [user.id]);
  const nome = perfil[0]?.nome ?? "";

  return jwt.sign(
    { id: user.id, email: user.email, tipo: user.tipo, nome },
    jwtSecret,
    { expiresIn: "8h" }
  );
};

const processPasswordRecovery = async (email) => {
  const { rows } = await query("SELECT id FROM usuarios WHERE email = $1", [email]);
  const user = rows[0];

  if (!user) return;

  const token = crypto.randomBytes(32).toString("hex");
  const expiration = new Date(Date.now() + 60 * 60 * 1000);

  await query(
    `INSERT INTO password_reset_tokens (usuario_id, token, expira_em)
     VALUES ($1, $2, $3)`,
    [user.id, token, expiration]
  );

  /**
   * Delegação estrita do envio para o adaptador de infraestrutura.
   * O domínio fornece apenas a semântica da mensagem.
   */
  const frontendUrl = process.env.FRONTEND_URL ?? "http://localhost:3000";
  const link = `${frontendUrl}/redefinir-senha?token=${token}`;


  await sendEmail({
    to: email,
    subject: "Redefinição de senha da sua conta PAVE",
    text: `Você solicitou a redefinição de senha da sua conta PAVE.\n\nAcesse o link abaixo para criar uma nova senha (válido por 1 hora):\n${link}\n\nSe você não solicitou isso, ignore este e-mail.`,
    html: recuperacaoSenhaHtml(link),
  });
};

const executePasswordReset = async (token, novaSenha) => {
  const client = await getClient();
  try {
    await client.query("BEGIN");

    const { rows } = await client.query(
      `SELECT id, usuario_id FROM password_reset_tokens
       WHERE token = $1 AND usado = FALSE AND expira_em > NOW() FOR UPDATE`,
      [token]
    );

    const resetRecord = rows[0];
    if (!resetRecord) {
      throw new Error("Token inválido, expirado ou já utilizado.");
    }

    const hashedPassword = await bcrypt.hash(novaSenha, SALT_ROUNDS);

    await client.query("UPDATE usuarios SET senha = $1 WHERE id = $2", [
      hashedPassword,
      resetRecord.usuario_id,
    ]);

    await client.query("UPDATE password_reset_tokens SET usado = TRUE WHERE id = $1", [
      resetRecord.id,
    ]);

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

const alterarSenha = async (usuarioId, { senhaAtual, novaSenha }) => {
  const { rows } = await query("SELECT senha FROM usuarios WHERE id = $1", [usuarioId]);
  const user = rows[0];
  if (!user) throw new Error("Usuário não encontrado.");

  const valid = await bcrypt.compare(senhaAtual, user.senha);
  if (!valid) throw new Error("Senha atual incorreta.");

  const hashed = await bcrypt.hash(novaSenha, SALT_ROUNDS);
  await query("UPDATE usuarios SET senha = $1 WHERE id = $2", [hashed, usuarioId]);
};

module.exports = {
  createDiscente,
  createDocente,
  authenticateUser,
  processPasswordRecovery,
  executePasswordReset,
  alterarSenha,
};