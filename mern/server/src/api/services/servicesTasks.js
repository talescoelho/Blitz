const models = require('../models');

// const SECRET_KEY = 'secretKey';

const data = {
  create: Date.now(),
  update: Date.now(),
};

const insertTaks = async (item) => {
  const tasks = await models.insertOne('tasks', { ...item, ...data });
  // console.log(tasks)
  return tasks;
};

module.exports = {
  insertTaks,
};
