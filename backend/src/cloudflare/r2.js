const { S3Client, PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const { randomUUID } = require("crypto");
const path = require("path");

const r2 = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId:     process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

const BUCKET     = process.env.R2_BUCKET_NAME;
const PUBLIC_URL = process.env.R2_PUBLIC_URL?.replace(/\/$/, "");

/**
 * Tipos MIME aceitos por categoria de upload.
 * A validação de tipo também ocorre no middleware (upload.js),
 * mas é repetida aqui como defesa em profundidade.
 */
const TIPOS_ACEITOS = {
  documento: new Set(["application/pdf"]),
  foto:      new Set(["image/jpeg", "image/png", "image/webp"]),
};

/**
 * Prefixos de caminho no bucket por categoria.
 * candidatura: candidaturas/{processoId}/{campoId}/{uuid}{ext}
 * perfil:      perfis/{usuarioId}/{uuid}{ext}
 */
const prefixo = {
  candidatura: (processoId, campoId) => `candidaturas/${processoId}/${campoId}`,
  perfil:      (usuarioId)           => `perfis/${usuarioId}`,
};

/**
 * Faz upload de um arquivo para o R2.
 *
 * O limite de tamanho já foi aplicado no nível do stream pelo multer
 * antes de chegar aqui. A verificação de tipo aqui é defesa em profundidade.
 *
 * @param {Buffer} buffer
 * @param {string} mimeType
 * @param {string} nomeOriginal  Usado apenas para extrair a extensão.
 * @param {string} pasta         Caminho dentro do bucket (use prefixo.*).
 * @param {"documento"|"foto"} categoria
 * @returns {Promise<string>}    URL pública permanente do arquivo.
 */
async function uploadArquivo(buffer, mimeType, nomeOriginal, pasta, categoria) {
  if (!TIPOS_ACEITOS[categoria]?.has(mimeType)) {
    throw new Error(`Tipo de arquivo não permitido para a categoria "${categoria}": ${mimeType}`);
  }

  const ext  = path.extname(nomeOriginal).toLowerCase() || ".bin";
  const chave = `${pasta}/${randomUUID()}${ext}`;

  await r2.send(new PutObjectCommand({
    Bucket:      BUCKET,
    Key:         chave,
    Body:        buffer,
    ContentType: mimeType,
  }));

  return `${PUBLIC_URL}/${chave}`;
}

/**
 * Remove um arquivo do R2 a partir da sua URL pública.
 * Útil ao substituir foto de perfil ou ao cancelar inscrição.
 *
 * @param {string} url  URL retornada por uploadArquivo.
 */
async function deletarArquivo(url) {
  const chave = url.replace(`${PUBLIC_URL}/`, "");
  await r2.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: chave }));
}

module.exports = { uploadArquivo, deletarArquivo, prefixo };
