const { Pool } = require("pg");
const { databaseUrl } = require("../config/env");

const pool = new Pool({
  connectionString: databaseUrl,
});

const connectDatabase = async () => {
  try {
    await pool.connect();
    console.log("Conexão com o banco de dados estabelecida.");
  } catch (error) {
    console.error("Erro ao conectar com o banco de dados:", error.message);
    process.exit(1);
  }
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
