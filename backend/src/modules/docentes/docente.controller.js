const docenteService = require("./docente.service");

const obterPerfil = async (req, res, next) => {
  try {
    const perfil = await docenteService.obterPerfil(req.user.id);
    res.json(perfil);
  } catch (err) {
    next(err);
  }
};

const atualizarPerfil = async (req, res, next) => {
  try {
    const { nome, telefone, departamento } = req.body;
    await docenteService.atualizarPerfil(req.user.id, { nome, telefone, departamento });
    res.json({ atualizado: true });
  } catch (err) {
    next(err);
  }
};

module.exports = { obterPerfil, atualizarPerfil };
