const servicesTasks = require('../services/servicesTasks');
const { StatusCodes } = require('http-status-codes');

const insertTaks = async (req, res) => {
  const { userId } = req;
  const task = await servicesTasks.insertTaks({ ...req.body, userId });
  return res.status(StatusCodes.OK).json({ task });
}

module.exports = {
  insertTaks,
}
