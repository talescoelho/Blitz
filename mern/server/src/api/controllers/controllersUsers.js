const { StatusCodes } = require('http-status-codes');
const servicesUsers = require('../services/servicesUsers');

const insertUser = async (req, res) => {
  const user = await servicesUsers.insertUser(req.body);
  return res.status(StatusCodes.OK).json({ user });
};

const logIn = async (req, res) => {
  const token = await servicesUsers.logIn(req.body);
  if (token.message) {
    return res.status(StatusCodes.NOT_ACCEPTABLE).json(token);
  }
  return res.status(StatusCodes.OK).json({ token });
};

module.exports = {
  insertUser,
  logIn,
};
