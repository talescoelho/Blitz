const axios = require('axios');

const GetAllUsers = async (token) => {
  try {
    const response = await axios.get('http://localhost:4000/users', { headers: { Authorization: token } });
    return response.data.users;
  } catch (error) {
    return error;
  }
};

module.exports = GetAllUsers;
