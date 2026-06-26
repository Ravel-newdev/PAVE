const docenteService = require("./docente.service");
 
const obterPerfil = async (req, res) => {
  const docente = await docenteService.obterPorId(req.user.id);
  res.status(200).json(docente);
};
 
const atualizarPerfil = async (req, res) => {
  const docente = await docenteService.atualizar(req.user.id, req.body);
  res.status(200).json(docente);
};
 
module.exports = { obterPerfil, atualizarPerfil };
