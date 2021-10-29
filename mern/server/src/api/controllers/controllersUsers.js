const servicesUsers = require('../services/servicesUsers');
const { StatusCodes } = require('http-status-codes');

const insertUser = async (req, res) => {
  const user = await servicesUsers.insertUser(req.body);
  return res.status(StatusCodes.OK).json({ user });
}

module.exports = {
  insertUser,
}
