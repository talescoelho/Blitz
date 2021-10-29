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
      .post('/users')
      .set({ 'Authorization': `${userRh.body.token}` })
      .send({
        'name': 'Test User',
        'email': 'test@mail.com',
        'password': '123123',
        'area': 'test',
      });
  });

  after(async () => {
    MongoClient.connect.restore();
    await DBServer.stop();
  });

  // Inserir users com sucesso
  describe('Quando inserir um usuário COM sucesso', () => {
    it('caminho: POST "/users" Inserir um novo usuario com sucesso', async () => {
      let user = await chai.request(server)
        .post('/users')
        .set({ 'Authorization': `${userRh.body.token}` })
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
      expect(user.body.user).to.have.property('create');
      expect(user.body.user).to.have.property('updated');
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
        .set({ 'Authorization': `${userRh.body.token}` })
        .send({
          'email': 'user@rh.com',
          'password': '123123',
          'area': 'rh',
        });
      expect(user).to.have.status(StatusCodes.NOT_FOUND);
      expect(user.body).to.have.property('message');
      expect(user.body.message).to.be.equal('Não é possível criar um usuário sem o campo "name"');
    });

    it('caminho: POST "/users" tentar inserir um usuário com o campo "name" vazio', async () => {
      let user = await chai.request(server)
        .post('/users')
        .set({ 'Authorization': `${userRh.body.token}` })
        .send({
          'name': '',
          'email': 'user@rh.com',
          'password': '123123',
          'area': 'rh',
        });
      expect(user).to.have.status(StatusCodes.NOT_FOUND);
      expect(user.body).to.have.property('message');
      expect(user.body.message).to.be.equal('Não é possível criar um usuário com o campo "name" vazio');
    });

    it('caminho: POST "/users" tentar inserir um usuário sem o campo "email"', async () => {
      let user = await chai.request(server)
        .post('/users')
        .set({ 'Authorization': `${userRh.body.token}` })
        .send({
          'name': 'User do RH',
          'password': '123123',
          'area': 'rh',
        });
      expect(user).to.have.status(StatusCodes.NOT_FOUND);
      expect(user.body).to.have.property('message');
      expect(user.body.message).to.be.equal('Não é possível criar um usuário sem o campo "email"');
    });

    it('caminho: POST "/users" tentar inserir um usuário com o campo "email" vazio', async () => {
      let user = await chai.request(server)
        .post('/users')
        .set({ 'Authorization': `${userRh.body.token}` })
        .send({
          'name': 'User do RH',
          'email': '',
          'password': '123123',
          'area': 'rh',
        });
      expect(user).to.have.status(StatusCodes.NOT_FOUND);
      expect(user.body).to.have.property('message');
      expect(user.body.message).to.be.equal('Não é possível criar um usuário com o campo "email" vazio');
    });
      
    it('caminho: POST "/users" tentar inserir um usuário sem o campo "password"', async () => {
      let user = await chai.request(server)
      .post('/users')
      .set({ 'Authorization': `${userRh.body.token}` })
      .send({
        'name': 'User do RH',
        'email': 'user@rh.com',
        'area': 'rh',
      });
      expect(user).to.have.status(StatusCodes.NOT_FOUND);
      expect(user.body).to.have.property('message');
      expect(user.body.message).to.be.equal('Não é possível criar um usuário sem o campo "password"');
    });

    it('caminho: POST "/users" tentar inserir um usuário com o campo "password" vazio', async () => {
      let user = await chai.request(server)
        .post('/users')
        .set({ 'Authorization': `${userRh.body.token}` })
        .send({
          'name': 'User do RH',
          'email': 'user@rh.com',
          'password': '',
          'area': 'rh',
        });
      expect(user).to.have.status(StatusCodes.NOT_FOUND);
      expect(user.body).to.have.property('message');
      expect(user.body.message).to.be.equal('Não é possível criar um usuário com o campo "password" vazio');
    });

    it('caminho: POST "/users" tentar inserir um usuário sem o campo "area"', async () => {
      let user = await chai.request(server)
        .post('/users')
        .set({ 'Authorization': `${userRh.body.token}` })
        .send({
          'name': 'User do RH',
          'email': 'user@rh.com',
          'password': '123123',
        });
      expect(user).to.have.status(StatusCodes.NOT_FOUND);
      expect(user.body).to.have.property('message');
      expect(user.body.message).to.be.equal('Não é possível criar um usuário sem o campo "area"');
    });

    it('caminho: POST "/users" tentar inserir um usuário com o campo "area" vazio', async () => {
      let user = await chai.request(server)
        .post('/users')
        .set({ 'Authorization': `${userRh.body.token}` })
        .send({
          'name': 'User do RH',
          'email': 'user@rh.com',
          'password': '123123',
          'area': '',
        });
      expect(user).to.have.status(StatusCodes.NOT_FOUND);
      expect(user.body).to.have.property('message');
      expect(user.body.message).to.be.equal('Não é possível criar um usuário com o campo "area" vazio');
    });

    it('caminho: POST "/users" tentar inserir um usuário que já existe', async () => {
      let user = await chai.request(server)
        .post('/users')
        .set({ 'Authorization': `${userRh.body.token}` })
        .send({
          'name': 'Test User',
          'email': 'test@mail.com',
          'password': '123123',
          'area': 'test',
        });
      expect(user).to.have.status(StatusCodes.CONFLICT);
      expect(user.body).to.have.property('message');
      expect(user.body.message).to.be.equal('Não usuário já existe');
    });
    
  });

  // Logar com sucesso
  describe('Logar com sucesso', () => {
    it('caminho: POST "/login" Logar com sucesso', async () => {
      let user = await chai.request(server)
        .post('/login')
        .send({
          'email': 'test@mail.com',
          'password': '123123',
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
      expect(user.body.message).to.be.equal('Email ou senha não conferem');
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
      expect(user.body.message).to.be.equal('Email ou senha não conferem');
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
      expect(user.body.message).to.be.equal('Email ou senha não conferem');
    });

    it('caminho: POST "/login" Logar com o email mal formatado', async () => {
      let user = await chai.request(server)
        .post('/login')
        .send({
          'email': 'test@rh.com',
          'password': '12312',
        });
      expect(user).to.have.status(StatusCodes.NOT_ACCEPTABLE);
      expect(user.body).to.have.property('message');
      expect(user.body.message).to.be.equal('Email ou senha não conferem');
    });
  });
});
