var express = require('express');
var router = express.Router();
const controllersUsers = require('../controllers/controllersUsers');

router.post('/', controllersUsers.insertUser);

module.exports = router;
