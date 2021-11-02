const models = require('../models');

// const SECRET_KEY = 'secretKey';

const data = {
  status: 'pendente',
};

const insertTaks = async (item) => {
  const tasks = await models.insertOne('tasks', { ...item, ...data });
  return tasks;
};

const getAllTasks = async () => {
  const tasks = await models.getAll('tasks');
  return tasks;
};

const getAllRoleTasks = async (item) => {
  const tasks = await models.findByfield('tasks', 'area', item);
  return tasks;
};

module.exports = {
  insertTaks,
  getAllTasks,
  getAllRoleTasks,
};
