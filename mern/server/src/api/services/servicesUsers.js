const models = require('../models');

const insertUser = async (item) => {
  const users = await models.insertOne('users', item);
  const { name, email, area, _id } = users;
  return { name, email, area, _id };
};

module.exports = {
  insertUser,
}
