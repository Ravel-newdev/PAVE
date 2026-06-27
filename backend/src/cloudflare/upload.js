const multer = require("multer");

const LIMITES = {
  documento: 10 * 1024 * 1024,
  foto:       5 * 1024 * 1024,
};

const TIPOS_ACEITOS = {
  documento: new Set(["application/pdf"]),
  foto:      new Set(["image/jpeg", "image/png", "image/webp"]),
};

/**
 * Cria um middleware de upload com limite de tamanho aplicado no nível do stream.
 * Erros do multer são tratados inline — nenhum handler de erro externo é necessário.
 *
 * @param {"documento"|"foto"} categoria
 * @returns Express middleware
 */
function criarUploadMiddleware(categoria) {
  const limite = LIMITES[categoria];
  const tipos  = TIPOS_ACEITOS[categoria];

  if (!limite || !tipos) throw new Error(`Categoria de upload desconhecida: ${categoria}`);

  const uploader = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: limite,
      files: 1,
      fields: 0,
    },
    fileFilter(_req, file, cb) {
      tipos.has(file.mimetype)
        ? cb(null, true)
        : cb(new Error(`Tipo inválido. Aceitos: ${[...tipos].join(", ")}`));
    },
  }).single("arquivo");

  return (req, res, next) => {
    uploader(req, res, (err) => {
      if (!err) return next();

      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          const mb = Math.round(limite / (1024 * 1024));
          return res.status(413).json({ message: `Arquivo excede o limite de ${mb} MB.` });
        }
        if (err.code === "LIMIT_FILE_COUNT") {
          return res.status(400).json({ message: "Envie apenas um arquivo por vez." });
        }
        return res.status(400).json({ message: `Erro no upload: ${err.message}` });
      }

      res.status(400).json({ message: err.message ?? "Erro inesperado no upload." });
    });
  };
}

module.exports = { criarUploadMiddleware, LIMITES };
