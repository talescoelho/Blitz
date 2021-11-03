const axios = require('axios');
const GetAllTasks = require('./GetAllTasks');

const DeleteTask = async (token, id) => {
  try {
    await axios.delete(`http://localhost:4000/tasks/${id}`, { headers: { Authorization: token } });
    const response = GetAllTasks(token);
    return response;
  } catch (error) {
    return error;
  }
};

module.exports = DeleteTask;
