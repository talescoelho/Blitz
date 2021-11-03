const axios = require('axios');

const login = async (items) => {
  try {
    const response = await axios.post('http://localhost:4000/login', items);
    localStorage.setItem('token', response.data.token);
    return response.data.token;
  } catch (error) {
    return error;
  }
};

module.exports = login;
