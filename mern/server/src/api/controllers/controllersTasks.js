const { StatusCodes } = require('http-status-codes');
const servicesTasks = require('../services/servicesTasks');

const insertTaks = async (req, res) => {
  const { userId, decoded } = req;
  const task = await servicesTasks.insertTaks({ ...req.body, userId, area: decoded.area });
  return res.status(StatusCodes.OK).json({ task });
};

const getAllTasks = async (req, res) => {
  const { userId, decoded } = req;
  let tasks = {};
  if (decoded.role === 'admin') {
    tasks = await servicesTasks.getAllTasks();
  } else {
    tasks = await servicesTasks.getAllRoleTasks(decoded.area);
    // console.log(tasks)
    tasks = tasks.filter((task) => !task.private || (task.private && task.userId === userId));
  }
  return res.status(StatusCodes.OK).json({ tasks });
};

const editTask = async (req, res) => {
  const { id } = req.params;
  const task = await servicesTasks.editTask(id, req.body);
  return res.status(StatusCodes.OK).json({ task });
};

const deleteTask = async (req, res) => {
  const { id } = req.params;
  const task = await servicesTasks.deleteTask(id);
  return res.status(StatusCodes.OK).json({ task });
};

module.exports = {
  insertTaks,
  getAllTasks,
  editTask,
  deleteTask,
};
