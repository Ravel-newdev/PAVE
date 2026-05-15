// connection.js
// Estabelece e gerencia conexão com o banco de dados.
const fs = require("fs");
const path = require("path");
const { Pool } = require("pg");
const { databaseUrl } = require("../config/env");

const pool = new Pool({
  connectionString: databaseUrl,
});

const connectDatabase = async () => {
  try {
    await pool.connect();
    console.log("Conexão com o banco de dados estabelecida.");

    // Verifica existência de tabelas no banco de dados e cria se não existir
    // Trecho relevante para configuração do ambiente
    if (!await existsTables()) {
      console.log("Iniciando a geração de tabelas do projeto.")
      await createTables()

      console.log("[DEBUG] Povoando o banco de dados para testes.")
      await populateDatabase()
    }
  } catch (error) {
    console.error("Erro ao conectar com o banco de dados:", error.message);
    process.exit(1);
  }
};

const existsTables = async () => {
  const result = await pool.query(`
    SELECT EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_name = 'usuarios'
    )
  `);
  return result.rows[0].exists;
};

const createTables = async () => {
  const sql = fs.readFileSync(
    path.join(__dirname, "schema.sql"),
    "utf8"
  );
  await pool.query(sql);
};

const populateDatabase = async () => {
  const sql = fs.readFileSync(
    path.join(__dirname, "populate.sql"),
    "utf8"
  );
  await pool.query(sql);
};

const query = async (text, params) => {
  const client = await pool.connect();
  try {
    return await client.query(text, params);
  } finally {
    client.release(); 
  }
};

const getClient = async () => {
  return await pool.connect();
};

module.exports = { pool, connectDatabase, query, getClient};
