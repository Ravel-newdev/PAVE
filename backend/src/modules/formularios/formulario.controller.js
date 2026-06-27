const formularioService = require("./formulario.service");

const listarCampos = async (req, res) => {
  const campos = await formularioService.listarCampos(req.params.id);
  res.status(200).json(campos);
};

module.exports = { listarCampos };
