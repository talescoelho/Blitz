const axios = require('axios');

const NewUser = async (token, items) => {
  try {
    const response = await axios.post('http://localhost:4000/users/', items, {
      headers: {
        Authorization: token,
      },
    });
    return response;
  } catch (error) {
    return error;
  }
};

module.exports = NewUser;
