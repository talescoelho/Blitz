const express = require('express');

const router = express.Router();
const controllersTasks = require('../controllers/controllersTasks');
const middlewaresTasks = require('../middlewares/middlewaresTasks');

router.post('/tasks',
  middlewaresTasks.validToken,
  middlewaresTasks.verifyTaskFields,
  controllersTasks.insertTaks);

router.put('/tasks',
  middlewaresTasks.validToken,
  middlewaresTasks.verifyTaskFields,
  middlewaresTasks.verifyId,
  controllersTasks.editTask);

router.get('/tasks',
  middlewaresTasks.validToken,
  controllersTasks.getAllTasks);

router.delete('/tasks/:id',
  middlewaresTasks.validToken,
  middlewaresTasks.verifyId,
  controllersTasks.deleteTask);

module.exports = router;
