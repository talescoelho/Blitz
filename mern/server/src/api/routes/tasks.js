const express = require('express');

const router = express.Router();
const controllersTasks = require('../controllers/controllersTasks');
const middlewaresTasks = require('../middlewares/middlewaresTasks');

router.post('/tasks',
  middlewaresTasks.validToken,
  middlewaresTasks.verifyTaskFields,
  controllersTasks.insertTaks);

router.get('/tasks',
  middlewaresTasks.validToken,
  controllersTasks.getAllTasks);

module.exports = router;
