const axios = require('axios');

const GetUser = async (userId) => {
  try {
    const response = await axios.get(`http://localhost:4000/users/${userId}`);
    return response.data.user;
  } catch (error) {
    return error;
  }
};

const GetAllTasks = async (token) => {
  try {
    const response = await axios.get('http://localhost:4000/tasks', { headers: { Authorization: token } });
    const allData = await Promise.all(response.data.tasks.map(async (task) => {
      const user = await GetUser(task.userId);
      return { ...task, ...user };
    }));
    return allData;
  } catch (error) {
    return error;
  }
};

module.exports = GetAllTasks;
