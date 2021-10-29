const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');

chai.use(chaiHttp);

const { expect } = chai

describe('Testes', () => {
  describe('Local: get "/"', () => {
    let response = {};
    it("verificando se o servidor ta on", async () => {
      response = await chai.request(server).get('/')

      expect(response).to.have.status(200);
    })
  });
});