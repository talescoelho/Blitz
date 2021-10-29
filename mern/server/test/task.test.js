const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
const sinon = require('sinon');
const { MongoClient } = require('mongodb');
const { MongoMemoryServer } = require('mongodb-memory-server');

chai.use(chaiHttp);

const { expect } = chai
const assert = chai.assert;

describe('Testes', () => {
  let response = {};
  let userLogin = {};
  let adminLogin = {};
  const DBServer = new MongoMemoryServer();

  before(async () => {
    const URLMock = await DBServer.getUri();
    const OPTIONS = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };
    const connectionMock = await MongoClient.connect(URLMock, OPTIONS);

    sinon.stub(MongoClient, 'connect').resolves(connectionMock);
  });

  after(async () => {
    MongoClient.connect.restore();
    await DBServer.stop();
  });
  describe('Local: get "/tasks"', () => {
    it("verificando se volta todas as tasks", async () => {
      let tasks =  await chai.request(server)
        .get('/tasks')
      expect(tasks).to.have.status(200)
      expect(tasks).to.be.an('object')
      expect(tasks.body[0].task).to.be.equal('Verificar os servidores')
      expect(tasks.body[0].status).to.be.equal('pendente')
      expect(tasks.body[0].userId).to.be.equal()
    })
  });
});