const { StatusCodes } = require('http-status-codes');
const servicesUsers = require('../services/servicesUsers');

const data = {
  role: 'user',
};

const insertUser = async (req, res) => {
  const user = await servicesUsers.insertUser({ ...req.body, ...data });
  return res.status(StatusCodes.OK).json({ user });
};

const logIn = async (req, res) => {
  const token = await servicesUsers.logIn(req.body);
  if (token.message) {
    return res.status(StatusCodes.NOT_ACCEPTABLE).json(token);
  }
  return res.status(StatusCodes.OK).json({ token });
};

const findId = async (req, res) => {
  const { id } = req.params;
  const user = await servicesUsers.findId(id);
  if (user.message) {
    return res.status(StatusCodes.NOT_ACCEPTABLE).json(user);
  }
  return res.status(StatusCodes.OK).json({ user });
};

module.exports = {
  insertUser,
  logIn,
  findId,
};
