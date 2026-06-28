const formularioService = require("./formulario.service");

const listarCampos = async (req, res) => {
  const campos = await formularioService.listarCampos(req.params.id);
  res.status(200).json(campos);
};

const criarCampo = async (req, res) => {
  const campo = await formularioService.criarCampo(req.params.id, req.body);
  res.status(201).json(campo);
};

const limparCamposPersonalizados = async (req, res) => {
  await formularioService.limparCamposPersonalizados(req.params.id);
  res.status(204).end();
};

module.exports = { listarCampos, criarCampo, limparCamposPersonalizados };
