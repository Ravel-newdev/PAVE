require("dotenv").config();

const requiredEnvVars = [
  "DATABASE_URL",
  "JWT_SECRET",
  "PORT",
];

requiredEnvVars.forEach((envVar) => {
  if (!process.env[envVar]) {
    throw new Error(`Variável de ambiente ausente: ${envVar}`);
  }
});

module.exports = {
  port: process.env.PORT,
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
};