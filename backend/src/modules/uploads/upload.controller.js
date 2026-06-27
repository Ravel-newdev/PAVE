const { uploadArquivo, prefixo } = require("../../cloudflare/r2");

const uploadCandidatura = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Nenhum arquivo recebido." });
  }

  const { processoId, campoId } = req.query;
  if (!processoId || !campoId) {
    return res.status(400).json({ message: "processoId e campoId são obrigatórios." });
  }

  const url = await uploadArquivo(
    req.file.buffer,
    req.file.mimetype,
    req.file.originalname,
    prefixo.candidatura(processoId, campoId),
    "documento"
  );

  res.status(201).json({ url });
};

module.exports = { uploadCandidatura };
