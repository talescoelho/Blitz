const axios = require('axios');

const UpdateTask = async (token, id, items) => {
  try {
    const response = await axios.put(`http://localhost:4000/tasks/${id}`, items, {
      headers: {
        Authorization: token,
      },
    });
    return response;
  } catch (error) {
    return error;
  }
};

module.exports = UpdateTask;
