/**
 * @file discente.controller.js
 * @description Orquestrador de requisições do domínio discente.
 */

const discenteService = require("./discente.service");
const { uploadArquivo, prefixo } = require("../../cloudflare/r2");

const listarFavoritos = async (req, res) => {
  const favoritos = await discenteService.listarFavoritos(req.user.id);
  res.status(200).json(favoritos);
};

const obterPerfil = async (req, res) => {
  const perfil = await discenteService.obterPerfil(req.user.id);
  res.status(200).json(perfil);
};

const atualizarPerfil = async (req, res) => {
  const perfil = await discenteService.atualizarPerfil(req.user.id, req.body);
  res.status(200).json(perfil);
};

const uploadFoto = async (req, res) => {
  const url = await uploadArquivo(
    req.file.buffer, req.file.mimetype, req.file.originalname,
    prefixo.perfil(req.user.id), "foto"
  );
  await discenteService.atualizarFoto(req.user.id, url);
  res.status(200).json({ url });
};

const uploadCurriculo = async (req, res) => {
  const url = await uploadArquivo(
    req.file.buffer, req.file.mimetype, req.file.originalname,
    prefixo.perfil(req.user.id), "documento"
  );
  await discenteService.atualizarCurriculo(req.user.id, url);
  res.status(200).json({ url });
};

module.exports = { listarFavoritos, obterPerfil, atualizarPerfil, uploadFoto, uploadCurriculo };