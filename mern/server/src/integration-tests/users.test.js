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
  });

  after(async () => {
    MongoClient.connect.restore();
    await DBServer.stop();
  });

  // Inserir users com sucesso
  describe('Quando inserir um usuário COM sucesso', () => {
    it('caminho: POST "/users" Quando inserir uma nova "task" com sucesso', async () => {
      let task = await chai.request(server)
        .post('/users')
        .set({ 'Authorization': `${userRh.body.token}` })
        .send({
          'name': 'Fulano do RH',
          'email': 'fulano@rh.com',
          'password': '123123',
          'area': 'rh',
        });
      expect(task).to.have.status(StatusCodes.OK);
      expect(task.body).to.have.property('user');
      expect(task.body.user).to.have.property('name');
      expect(task.body.user).to.have.property('email');
      expect(task.body.user).to.have.property('area');
      expect(task.body.user.name).to.be.equal('Fulano do RH');
      expect(task.body.user.email).to.be.equal('fulano@rh.com');
      expect(task.body.user.area).to.be.equal('rh');
    });
  });
});
