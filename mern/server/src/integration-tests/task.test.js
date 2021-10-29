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

describe('Teste: Tasks', () => {
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

  // Inserir users com sucesso
  describe('Quando inserir um usuário COM sucesso', () => {
    it('caminho: POST "/users" Inserir um novo usuario com sucesso', async () => {
      let user = await chai.request(server)
        .post('/users')
        .send({
          'name': 'User do RH',
          'email': 'user@rh.com',
          'password': '123123',
          'area': 'rh',
        });
      expect(user).to.have.status(StatusCodes.OK);
      expect(user.body).to.have.property('user');
      expect(user.body.user).to.have.property('name');
      expect(user.body.user).to.have.property('email');
      expect(user.body.user).to.have.property('area');
      expect(user.body.user.name).to.be.equal('User do RH');
      expect(user.body.user.email).to.be.equal('user@rh.com');
      expect(user.body.user.area).to.be.equal('rh');
    });
  });

  // Inserir users sem sucesso
  describe('Quando inserir um usuário SEM sucesso', () => {
    it('caminho: POST "/users" tentar inserir um usuário sem o campo "name"', async () => {
      let user = await chai.request(server)
        .post('/users')
        .send({
          'email': 'user@rh.com',
          'password': '123123',
          'area': 'rh',
        });
      expect(user).to.have.status(StatusCodes.NOT_FOUND);
      expect(user.body).to.have.property('message');
      expect(user.body.message).to.be.equal('"name" is required');
    });

    it('caminho: POST "/users" tentar inserir um usuário com o campo "name" vazio', async () => {
      let user = await chai.request(server)
        .post('/users')
        .send({
          'name': '',
          'email': 'user@rh.com',
          'password': '123123',
          'area': 'rh',
        });
      expect(user).to.have.status(StatusCodes.NOT_FOUND);
      expect(user.body).to.have.property('message');
      expect(user.body.message).to.be.equal('"name" is not allowed to be empty');
    });

    it('caminho: POST "/users" tentar inserir um usuário sem o campo "email"', async () => {
      let user = await chai.request(server)
        .post('/users')
        .send({
          'name': 'User do RH',
          'password': '123123',
          'area': 'rh',
        });
      expect(user).to.have.status(StatusCodes.NOT_FOUND);
      expect(user.body).to.have.property('message');
      expect(user.body.message).to.be.equal('"email" is required');
    });

    it('caminho: POST "/users" tentar inserir um usuário com o campo "email" vazio', async () => {
      let user = await chai.request(server)
        .post('/users')
        .send({
          'name': 'User do RH',
          'email': '',
          'password': '123123',
          'area': 'rh',
        });
      expect(user).to.have.status(StatusCodes.NOT_FOUND);
      expect(user.body).to.have.property('message');
      expect(user.body.message).to.be.equal('"email" is not allowed to be empty');
    });
      
    it('caminho: POST "/users" tentar inserir um usuário sem o campo "password"', async () => {
      let user = await chai.request(server)
      .post('/users')
      .send({
        'name': 'User do RH',
        'email': 'user@rh.com',
        'area': 'rh',
      });
      expect(user).to.have.status(StatusCodes.NOT_FOUND);
      expect(user.body).to.have.property('message');
      expect(user.body.message).to.be.equal('"password" is required');
    });

    it('caminho: POST "/users" tentar inserir um usuário com o campo "password" vazio', async () => {
      let user = await chai.request(server)
        .post('/users')
        .send({
          'name': 'User do RH',
          'email': 'user@rh.com',
          'password': '',
          'area': 'rh',
        });
      expect(user).to.have.status(StatusCodes.NOT_FOUND);
      expect(user.body).to.have.property('message');
      expect(user.body.message).to.be.equal('"password" is not allowed to be empty');
    });

    it('caminho: POST "/users" tentar inserir um usuário sem o campo "area"', async () => {
      let user = await chai.request(server)
        .post('/users')
        .send({
          'name': 'User do RH',
          'email': 'user@rh.com',
          'password': '123123',
        });
      expect(user).to.have.status(StatusCodes.NOT_FOUND);
      expect(user.body).to.have.property('message');
      expect(user.body.message).to.be.equal('"area" is required');
    });

    it('caminho: POST "/users" tentar inserir um usuário com o campo "area" vazio', async () => {
      let user = await chai.request(server)
        .post('/users')
        .send({
          'name': 'User do RH',
          'email': 'user@rh.com',
          'password': '123123',
          'area': '',
        });
      expect(user).to.have.status(StatusCodes.NOT_FOUND);
      expect(user.body).to.have.property('message');
      expect(user.body.message).to.be.equal('"area" is not allowed to be empty');
    });

    it('caminho: POST "/users" tentar inserir um usuário que já existe', async () => {
      let user = await chai.request(server)
        .post('/users')
        .send({
          'name': 'admin',
          'email': 'admin@admin.com',
          'password': 'admin123',
          'area': 'admin',
        });
      expect(user).to.have.status(StatusCodes.CONFLICT);
      expect(user.body).to.have.property('message');
      expect(user.body.message).to.be.equal('Email already registered');
    });
    
  });

  // Logar com sucesso
  describe('Logar com sucesso', () => {
    it('caminho: POST "/login" Logar com sucesso', async () => {
      let user = await chai.request(server)
        .post('/login')
        .send({
          'email': 'rh@email.com',
          'password': 'rh123',
        });
      expect(user).to.have.status(StatusCodes.OK);
      expect(user.body).to.have.property('token');
    });
  });

  // Logar sem sucesso
  describe('Quando tenta logar e não tem sucesso', () => {
    it('caminho: POST "/login" Logar com o email mal formatado', async () => {
      let user = await chai.request(server)
        .post('/login')
        .send({
          'email': 'test@rh.',
          'password': '123123',
        });
      expect(user).to.have.status(StatusCodes.NOT_ACCEPTABLE);
      expect(user.body).to.have.property('message');
      expect(user.body.message).to.be.equal('Email or password do not match');
    });

    it('caminho: POST "/login" Logar com o email mal formatado', async () => {
      let user = await chai.request(server)
        .post('/login')
        .send({
          'email': '@rh.com',
          'password': '123123',
        });
      expect(user).to.have.status(StatusCodes.NOT_ACCEPTABLE);
      expect(user.body).to.have.property('message');
      expect(user.body.message).to.be.equal('Email or password do not match');
    });

    it('caminho: POST "/login" Logar com o email mal formatado', async () => {
      let user = await chai.request(server)
        .post('/login')
        .send({
          'email': 'testrh.com',
          'password': '123123',
        });
      expect(user).to.have.status(StatusCodes.NOT_ACCEPTABLE);
      expect(user.body).to.have.property('message');
      expect(user.body.message).to.be.equal('Email or password do not match');
    });

    it('caminho: POST "/login" Email ou senha não conferem', async () => {
      let user = await chai.request(server)
        .post('/login')
        .send({
          'email': 'test@rh.com',
          'password': '12',
        });

      expect(user).to.have.status(StatusCodes.NOT_ACCEPTABLE);
      expect(user.body).to.have.property('message');
      expect(user.body.message).to.be.equal('Email or password do not match');
    });
  });
});
