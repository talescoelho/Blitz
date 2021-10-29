var express = require('express');
var router = express.Router();
const controllersUsers = require('../controllers/controllersUsers');
const middlewaresUsers = require('../middlewares/middlewaresUsers');

router.post('/', middlewaresUsers.verifyUserFields, controllersUsers.insertUser);

module.exports = router;
