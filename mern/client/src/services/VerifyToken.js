const verifyToken = () => {
  const token = localStorage.getItem('token');
  if (token) {
    return token;
  }
  return false;
};

module.exports = verifyToken;
