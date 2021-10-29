const models = require('../models');
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'secretKey';

const insertUser = async (item) => {
  const users = await models.insertOne('users', item);
  const { name, email, area, _id } = users;
  return { name, email, area, _id };
};

const logIn = async (item) => {
  const user = await models.logIn('users', item);
  if (!user) {
    return { message: 'Email or password do not match' };
  }
  const { name, email, area, _id } = user;
  token = jwt.sign({ name, email, area, _id }, SECRET_KEY)
  return token;
};

module.exports = {
  insertUser,
  logIn,
}
