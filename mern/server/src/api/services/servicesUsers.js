const models = require('../models');

const getAllUsers = async () => {
  const users = models.getAll('users');
  return users;
};

const insertUser = async (item) => {
  const users = models.insertOne('users', item);
  return users;
};

module.exports = {
  getAllUsers,
  insertUser,
}
