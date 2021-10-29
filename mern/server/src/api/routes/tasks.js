var express = require('express');
var router = express.Router();
const controllersTasks = require('../controllers/controllersTasks');
const middlewaresTasks = require('../middlewares/middlewaresTasks');

router.post('/tasks',
  middlewaresTasks.validToken,
  middlewaresTasks.verifyTaskFields,
  controllersTasks.insertTaks);

module.exports = router;
