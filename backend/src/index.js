require("dotenv").config({ quiet: true });

const express = require("express");
const cors = require("cors");
const router = require("./routes");
const { connectDatabase } = require("./database/connection");
const errorHandler = require("./middlewares/error.middleware");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

// O registro do middleware global de erros deve ocorrer após as rotas
app.use(errorHandler);

connectDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
});