const axios = require('axios');

const NewTask = async (token, items) => {
  try {
    const response = await axios.post('http://localhost:4000/tasks/', items, {
      headers: {
        Authorization: token,
      },
    });
    return response;
  } catch (error) {
    return error;
  }
};

module.exports = NewTask;
