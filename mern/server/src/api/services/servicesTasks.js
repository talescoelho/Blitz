const models = require('../models');

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

const editTask = async (id, item) => {
  const task = await models.updateOne('tasks', id, { ...item });
  return task;
};

const deleteTask = async (id) => {
  const task = await models.deleteOne('tasks', id);
  return task;
};

module.exports = {
  insertTaks,
  getAllTasks,
  getAllRoleTasks,
  editTask,
  deleteTask,
};
