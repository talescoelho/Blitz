const jwt = require('jsonwebtoken');
const models = require('../models');

const SECRET_KEY = 'secretKey';

const insertUser = async (item) => {
  const users = await models.insertOne('users', item);
  const {
    name, email, area, _id, role,
  } = users;
  return {
    name, email, area, _id, role,
  };
};

const logIn = async (item) => {
  const user = await models.logIn('users', item);
  if (!user) {
    return { message: 'Email or password do not match' };
  }
  const {
    name, area, _id, role,
  } = user;
  const token = jwt.sign({
    name, area, _id, role,
  }, SECRET_KEY);
  return token;
};

module.exports = {
  insertUser,
  logIn,
};
