const chai = require('chai');
const http = require('chai-http');
chai.use(http);
const server = require('../api/app');
const { MongoClient } = require('mongodb');

const mongoDbUrl = 'mongodb+srv://romulo:987321@cluster0.doltv.mongodb.net/Cookmaster'
// const mongoDbUrl = 'mongodb://mongodb:27017/Cookmaster';

describe('Routes: Users', () => {
  let connection;
  let db;

  const defaultUser = {
    name: 'Rômulo Franco',
    email: 'romulojosefranco@gmail.com',
    password: '987321',
  };

  before(async () => {
    connection = await MongoClient.connect(mongoDbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = connection.db('Cookmaster');
    await db.collection('users').deleteMany({});
    await db.collection('recipes').deleteMany({});
    const users = {
      name: 'admin', email: 'root@email.com', password: 'admin', role: 'admin'
    };
    await db.collection('users').insertOne(users);
  });

  after(async () => {
    await connection.close();
  });

  describe('GET /users', () => {
    before(async () => {
      response = await chai.request(server)
        .get('/users')
        .send();
    })

    it('Testing data returned from GET of collection users', () => {
      chai.expect(response).to.have.status(200);
      chai.expect(response.body).to.be.a('array');
      chai.expect(response.body[0]._id).to.be.an('string');
      chai.expect(response.body[0].name).to.be.an('string');
      chai.expect(response.body[0].email).to.be.an('string');
      chai.expect(response.body[0].password).to.be.an('string');
      chai.expect(response.body[0].role).to.be.an('string');
    });
  });

  describe('POST /users', () => {
    it('Testing data returned with POST in the collection users', async () => {
      response = await chai.request(server)
        .post('/users')
        .send(defaultUser);

      chai.expect(response).to.have.status(201);
      chai.expect(response.body.user.name).to.equal(defaultUser.name);
      chai.expect(response.body.user.email).to.equal(defaultUser.email);
      chai.expect(response.body.user.role).to.equal('user');
      chai.expect(response.body).to.be.a('object');
    });
  });

  describe('POST /users', () => {
    it('Testing data validation with POST in the collection users', async () => {
      response = await chai.request(server)
        .post('/users')
        .send({
          name: 'Rômulo Franco',
          email: 'romulojosefranco@gmail.com',
          password: '987321',
        });

      chai.expect(response).to.have.status(400);
      chai.expect(response.body).to.have.property('message');
      chai.expect(response.body).to.be.a('object');
      chai.expect(response.body.message).to.equal('Invalid entries. Try again.');
    });
  });

  describe('POST /users', () => {
    it('Testing return of email validation with POST in the collection users', async () => {
      response = await chai.request(server)
        .post('/users')
        .send({
          name: 'admin',
          email: 'root@email.com',
          password: 'admin',
        });

      chai.expect(response).to.have.status(409);
      chai.expect(response.body).to.have.property('message');
      chai.expect(response.body).to.be.a('object');
      chai.expect(response.body.message).to.equal('Email already registered');
    });
  });

  describe('POST /admin', () => {
    it('Testing data returned with POST in the collection users for a admin user', async () => {
      const token = await chai.request(server)
        .post('/login')
        .send({
          email: 'root@email.com',
          password: 'admin',
        })
        .then(({ body }) => body.token);

      response = await chai.request(server)
        .post('/users/admin')
        .set('Authorization', token)
        .send({
          name: 'romulo',
          email: 'romulo@mail.com',
          password: 'romulo',
          role: 'admin'
        });

      chai.expect(response).to.have.status(201);
      chai.expect(response.body.user.name).to.equal('romulo');
      chai.expect(response.body.user.email).to.equal('romulo@mail.com');
      chai.expect(response.body).to.be.a('object');

    });
  });

  describe('POST of an admin with an email already registered', () => {

    it('Return error 401', async () => {
      const token = await chai.request(server)
        .post('/login')
        .send({
          email: 'root@email.com',
          password: 'admin',
        })
        .then(({ body }) => body.token);

      response = await chai.request(server)
        .post('/users/admin')
        .set('Authorization', token)
        .send({
          name: 'admin',
          email: 'root@email.com',
          password: 'admin',
        });

      chai.expect(response).to.have.status(409);
      chai.expect(response.body).to.have.property('message');
      chai.expect(response.body).to.be.a('object');
      chai.expect(response.body.message).to.equal('Email already registered');
    })

    describe('POST of an admin user with an not admin user', () => {

      it('Return error 401', async () => {
        const token = await chai.request(server)
          .post('/login')
          .send({
            email: 'romulojosefranco@gmail.com',
            password: '987321',
          })
          .then(({ body }) => body.token);

        response = await chai.request(server)
          .post('/users/admin')
          .set('Authorization', token)
          .send({
            name: 'admin',
            email: 'admin@email.com',
            password: 'admin',
          });

        chai.expect(response).to.have.status(403);
        chai.expect(response.body).to.have.property('message');
        chai.expect(response.body).to.be.a('object');
        chai.expect(response.body.message).to.equal('Only admins can register new admins');
      })
    })
  });

  describe('Validation of a POST of an admin user', () => {

    it('Return error 401', async () => {
      const token = await chai.request(server)
        .post('/login')
        .send({
          email: 'root@email.com',
          password: 'admin',
        })
        .then(({ body }) => body.token);

      response = await chai.request(server)
        .post('/users/admin')
        .set('Authorization', token)
        .send({
          name: 'admin',
          email: 'admin',
          password: 'admin',
        });

      chai.expect(response).to.have.status(400);
      chai.expect(response.body).to.have.property('message');
      chai.expect(response.body).to.be.a('object');
      chai.expect(response.body.message).to.equal('Invalid entries. Try again.');
    })
  })
});