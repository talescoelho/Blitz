const servicesUsers = require('../services/servicesUsers');

const getAllUsers = async (req, res) => {
  const users = servicesUsers.getAllUsers();
  res.status(200).json({ users });
}

const insertUser = async (req, res) => {
  const user = servicesUsers.insertUser(req.body);
  res.status(200).json({ user });
}

module.exports = {
  getAllUsers,
  insertUser,
}
