const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { query, getClient } = require("../../database/connection");
const { jwtSecret } = require("../../config/env");

// Custo de hashing
const SALT_ROUNDS = 12;

const createDiscente = async ({ nome, email, senha, matricula, curso, telefone }) => {
  const client = await getClient();

  console.log("Registro de discente detectado.");

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
      `INSERT INTO discentes (id, nome, email, matricula, curso, telefone)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [id, nome, email, matricula, curso, telefone]
    );

    await client.query("COMMIT");
    return { nome, email, tipo: "discente" };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    // Libera o client independentemente do resultado
    client.release();
  }
};

const createDocente = async ({ nome, email, senha, matricula, departamento, telefone }) => {
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
      `INSERT INTO docentes (id, nome, email, matricula, departamento, telefone)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [id, nome, email, matricula, departamento, telefone]
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
  // Busca apenas os campos necessários para autenticação
  const { rows } = await query(
    "SELECT id, email, senha, tipo FROM usuarios WHERE email = $1",
    [email]
  );

  const user = rows[0];
  if (!user) throw new Error("Credenciais inválidas.");

  const valid = await bcrypt.compare(senha, user.senha);
  if (!valid) throw new Error("Credenciais inválidas.");

  // necessário para identificação e RBAC
  return jwt.sign(
    { id: user.id, email: user.email, tipo: user.tipo },
    jwtSecret,
    { expiresIn: "8h" }
  );
};

module.exports = { createDiscente, createDocente, authenticateUser };