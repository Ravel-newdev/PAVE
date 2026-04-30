const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { pool } = require("../../database/connection");
const { jwtSecret } = require("../../config/env");

const createUser = async ({ nome, email, senha, perfil }) => {
  const hashedPassword = await bcrypt.hash(senha, 10);
  const result = await pool.query(
    "INSERT INTO users (nome, email, senha, perfil) VALUES ($1, $2, $3, $4) RETURNING id, nome, email, perfil",
    [nome, email, hashedPassword, perfil]
  );
  return result.rows[0];
};

const authenticateUser = async ({ email, senha }) => {
  const result = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );
  const user = result.rows[0];
  if (!user) throw new Error("Credenciais inválidas.");

  const valid = await bcrypt.compare(senha, user.senha);
  if (!valid) throw new Error("Credenciais inválidas.");

  return jwt.sign(
    { id: user.id, email: user.email, perfil: user.perfil },
    jwtSecret,
    { expiresIn: "8h" }
  );
};

module.exports = { createUser, authenticateUser };