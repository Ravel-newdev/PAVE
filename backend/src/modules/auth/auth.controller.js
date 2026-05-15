const { createDiscente, createDocente, authenticateUser } = require("./auth.service");

const registerDiscente = async (req, res) => {
  try {
    const user = await createDiscente(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const registerDocente = async (req, res) => {
  try {
    const user = await createDocente(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const token = await authenticateUser(req.body);
    res.status(200).json({ token });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

module.exports = { registerDiscente, registerDocente, login };