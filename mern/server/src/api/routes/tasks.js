const express = require('express');

const router = express.Router();
const controllersTasks = require('../controllers/controllersTasks');
const middlewaresTasks = require('../middlewares/middlewaresTasks');

router.post('/tasks',
  middlewaresTasks.validToken,
  middlewaresTasks.verifyTaskFields,
  controllersTasks.insertTaks);

router.get('/tasks',
  controllersTasks.getAllTasks);

module.exports = router;

// caminho: GET "/tasks" usuário comum recuperando todas as "tasks"
//   2) caminho: GET "/tasks" "ADMIN" comum recuperando todas as "tasks"
// Recuperar as "tasks"
//   3) caminho: GET "/tasks/:id" usuário recuperando suas próprias tasks
//   4) caminho: GET "/tasks/:id" sem task inserida pelo usuário
// Recuperar as "tasks"
//   5) caminho: GET "/tasks/search" usuário recuperando as tasks de sua "area"
//   6) caminho: GET "/tasks/search" "ADMIN" recuperando as tasks de outra "area"
//   7) caminho: GET "/tasks/search" usuário recuperando as tasks de outra "area"
