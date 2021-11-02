const axios = require('axios');

const login = async (items) => {
  try {
    const response = await axios.post('http://localhost:4000/login', items);
    return response.data.token;
  } catch (error) {
    console.log(error.message);
    return error;
  }
};

module.exports = login;
