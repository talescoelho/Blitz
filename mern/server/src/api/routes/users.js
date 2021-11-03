const express = require('express');

const router = express.Router();
const controllersUsers = require('../controllers/controllersUsers');
const middlewaresUsers = require('../middlewares/middlewaresUsers');

router.post('/users', middlewaresUsers.verifyUserFields, controllersUsers.insertUser);
router.post('/login', middlewaresUsers.verifyLoginFields, controllersUsers.logIn);

module.exports = router;
