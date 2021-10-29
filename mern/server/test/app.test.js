const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
// const sinon = require('sinon');
// const fs = require('fs');
// const { MongoClient } = require('mongodb');
// const { MongoMemoryServer } = require('mongodb-memory-server');

chai.use(chaiHttp);

const { expect } = chai
// const assert = chai.assert;

describe('Testes', () => {
  describe('Local: get "/"', () => {
    let response = {};
    it("verificando se o servidor ta on", async () => {
      response = await chai.request(server).get('/')

      console.log(response)
      expect(response).to.have.status(200);
    })
  });
});