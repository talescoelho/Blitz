const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../api/app');
const sinon = require('sinon');
const { MongoClient } = require('mongodb');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { StatusCodes } = require('http-status-codes');
const models = require('../api/models');
const jwt = require('jsonwebtoken');

chai.use(chaiHttp);

const { expect } = chai;
const SECRET_KEY = 'secretKey';

describe('Teste de integração', () => {
  let response = {};
  let userRh = {};
  let admUser = {};
  let admKey = {};
  const DBServer = new MongoMemoryServer();

  before(async () => {
    const URLMock = await DBServer.getUri();
    const OPTIONS = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };
    const connectionMock = await MongoClient.connect(URLMock, OPTIONS);
    
    sinon.stub(MongoClient, 'connect').resolves(connectionMock);

    await chai.request(server)
      .post('/users')
      .send({
        'name': 'rhTeste',
        'email': 'rh@email.com',
        'password': 'rh123',
        'area': 'rh'
      });
      
    userRh = await chai.request(server)
      .post('/login')
      .send({
        'email': 'rh@email.com',
        'password': 'rh123'
      });
    
    admUser = await models.insertAdminUser('users', {
      'name': 'admin',
      'email': 'admin@admin.com',
      'password': 'admin123',
      'area': 'admin',
      'role': 'admin',
    })

    const { _id, name, area, role } = admUser;

    admKey = jwt.sign({ _id, name, area, role }, SECRET_KEY)

    await chai.request(server)
      .post('/tasks')
      .set({ 'Authorization': `${admKey}` })
      .send({
        'task': 'Verificar contratações como ADMIN',
        'private': false,
      });
  });

  after(async () => {
    MongoClient.connect.restore();
    await DBServer.stop();
  });

  // Inserir tasks com sucesso
  describe('Quando inserir uma task COM sucesso', () => {
    it('caminho: POST "/tasks" Quando inserir uma nova "task" com sucesso', async () => {
      let task = await chai.request(server)
        .post('/tasks')
        .set({ 'Authorization': `${userRh.body.token}` })
        .send({
          'task': 'Verificar contratações',
          'private': false,
        });
      expect(task).to.have.status(StatusCodes.OK);
      expect(task.body.task).to.have.property('task');
      expect(task.body.task).to.have.property('create');
      expect(task.body.task).to.have.property('update');
      expect(task.body.task).to.have.property('userId');
      expect(task.body.task.task).to.be.equal('Verificar contratações');
    });
  });

  // Inserir tasks sem sucesso
  describe('Quando inserir uma task SEM sucesso', () => {
    it('caminho: POST "/tasks" Quando inserir uma nova "task" com o campo "task" vazio', async () => {
      let task = await chai.request(server)
        .post('/tasks')
        .set({ 'Authorization': `${userRh.body.token}` })
        .send({
          'task': '',
          'private': false,
        });
      expect(task).to.have.status(StatusCodes.BAD_REQUEST);
      expect(task.body).to.have.property('message');
      expect(task.body.message).to.be.equal('Favor não inserir o campo vazio');
    });

    it('caminho: POST "/tasks" Quando inserir uma nova "task" sem o campo "task"', async () => {
      let task = await chai.request(server)
        .post('/tasks')
        .set({ 'Authorization': `${userRh.body.token}` })
        .send({
          'private': false,
        });
      expect(task).to.have.status(StatusCodes.BAD_REQUEST);
      expect(task.body).to.have.property('message');
      expect(task.body.message).to.be.equal('Favor não inserir o campo vazio');
    });

    it('caminho: POST "/tasks" Quando inserir uma nova "task" sem o campo "private"', async () => {
      let task = await chai.request(server)
        .post('/tasks')
        .set({ 'Authorization': `${userRh.body.token}` })
        .send({
          'task': 'Verificar contratações',
        });
      expect(task).to.have.status(StatusCodes.BAD_REQUEST);
      expect(task.body).to.have.property('message');
      expect(task.body.message).to.be.equal('Favor não inserir o campo vazio');
    });

    it('caminho: POST "/tasks" Quando inserir uma "task" sem estar "logado"', async () => {
      const invalidToken = 'invalidToken'
      let task = await chai.request(server)
        .post('/tasks')
        .set({ 'Authorization': `${invalidToken}` })
        .send({
          'task': 'Verificar contratações',
          'private': false,
        });
      expect(task).to.have.status(StatusCodes.UNAUTHORIZED);
      expect(task.body).to.have.property('message');
      expect(task.body.message).to.be.equal('Favor logar para inserir uma nova tarefa');
    });
  });

  // recuperar todas as tasks
  describe('Recuperar as "tasks"', () => {
    it('caminho: GET "/tasks" usuário comum recuperando todas as "tasks"', async () => {
      await chai.request(server)
        .post('/tasks')
        .set({ 'Authorization': `${userRh.body.token}` })
        .send({
          'task': 'Verificar contratações',
          'private': false,
        });
      let tasks = await chai.request(server)
        .get('/tasks')
        .set({ 'Authorization': `${userRh.body.token}` });
      expect(tasks).to.have.status(StatusCodes.OK);
      expect(tasks.body.tasks[0]).to.have.property('task');
      expect(tasks.body.tasks[0].task).to.be.equal('Verificar contratações');
      expect(tasks.body.tasks.length).to.be.equal(1);
    });

    it('caminho: GET "/tasks" "ADMIN" comum recuperando todas as "tasks"', async () => {
      await chai.request(server)
        .post('/tasks')
        .set({ 'Authorization': `${userRh.body.token}` })
        .send({
          'task': 'Verificar contratações',
          'private': false,
        });
      let tasks = await chai.request(server)
        .get('/tasks')
        .set({ 'Authorization': `${admKey}` });
      expect(tasks).to.have.status(StatusCodes.OK);
      expect(tasks.body.tasks[0]).to.have.property('task');
      expect(tasks.body.tasks[0].task).to.be.equal('Verificar contratações como ADMIN');
      expect(tasks.body.tasks.length).to.be.equal(2);
    });
  });

  // recuperar as próprias tasks
  describe('Recuperar as "tasks"', () => {
    it('caminho: GET "/tasks/:id" usuário recuperando suas próprias tasks', async () => {
      await chai.request(server)
        .post('/tasks/')
        .set({ 'Authorization': `${userRh.body.token}` })
        .send({
          'task': 'Verificar contratações',
          'private': false,
        });
      let tasks = await chai.request(server)
        .get(`/tasks/${userRh.body.id}`)
        .set({ 'Authorization': `${userRh.body.token}` });
      expect(tasks).to.have.status(StatusCodes.OK);
      expect(tasks.body.tasks[0]).to.have.property('task');
      expect(tasks.body.tasks[0].task).to.be.equal('Verificar contratações');
      expect(tasks.body.tasks.length).to.be.equal(1);
    });

    it('caminho: GET "/tasks/:id" sem task inserida pelo usuário', async () => {
      let tasks = await chai.request(server)
        .get(`/tasks/${userRh.body.id}`)
        .set({ 'Authorization': `${userRh.body.token}` });
      expect(tasks).to.have.status(StatusCodes.NOT_FOUND);
      expect(tasks.body).to.have.property('message');
      expect(tasks.body.message).to.be.equal('Não há nem uma task inserida');
    });
  });

  // recuperar todas as tasks do setor
  describe('Recuperar as "tasks"', () => {
    it('caminho: GET "/tasks/search" usuário recuperando as tasks de sua "area"', async () => {
      await chai.request(server)
        .post('/tasks/')
        .set({ 'Authorization': `${userRh.body.token}` })
        .send({
          'task': 'Verificar contratações',
          'private': false,
        });
      let tasks = await chai.request(server)
        .get('/tasks/?area="RH"')
        .set({ 'Authorization': `${admKey}` });
      expect(tasks).to.have.status(StatusCodes.OK);
      expect(tasks.body.tasks[0]).to.have.property('task');
      expect(tasks.body.tasks[0].task).to.be.equal('Verificar contratações');
      expect(tasks.body.tasks.length).to.be.equal(1);
    });

    it('caminho: GET "/tasks/search" "ADMIN" recuperando as tasks de outra "area"', async () => {
      await chai.request(server)
        .post('/tasks/')
        .set({ 'Authorization': `${userRh.body.token}` })
        .send({
          'task': 'Verificar contratações',
          'private': false,
        });
      let tasks = await chai.request(server)
        .get('/tasks/?area="RH"')
        .set({ 'Authorization': `${userRh.body.token}` });
      expect(tasks).to.have.status(StatusCodes.OK);
      expect(tasks.body.tasks[0]).to.have.property('task');
      expect(tasks.body.tasks[0].task).to.be.equal('Verificar contratações');
      expect(tasks.body.tasks.length).to.be.equal(1);
    });

    it('caminho: GET "/tasks/search" usuário recuperando as tasks de outra "area"', async () => {
      await chai.request(server)
        .post('/tasks/')
        .set({ 'Authorization': `${userRh.body.token}` })
        .send({
          'task': 'Verificar contratações',
          'private': false,
        });
      let tasks = await chai.request(server)
        .get('/tasks/?area="RH"')
        .set({ 'Authorization': `${userRh.body.token}` });
      expect(tasks).to.have.status(StatusCodes.UNAUTHORIZED);
      expect(tasks.body).to.have.property('message');
      expect(tasks.body.message).to.be.equal('Você não tem permissão para ver as tasks de outros setores');
    });
  });
});
