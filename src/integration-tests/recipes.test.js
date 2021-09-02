const chai = require('chai');
const fs = require('fs');
const path = require('path');
const http = require('chai-http');
chai.use(http);
const server = require('../api/app');
const { MongoClient } = require('mongodb');

const mongoDbUrl = 'mongodb://mongodb:27017/Cookmaster';

describe('Testes na rota Recipes', () => {
  let connection;
  let db;

  const defaultRecipe = {
    name: 'banana com mel e granola',
    ingredients: 'banana e mel e granola',
    preparation: 'misturar todos ingredientes'
  };

  before(async () => {
    connection = await MongoClient.connect(mongoDbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = connection.db('Cookmaster');
    await db.collection('users').deleteMany({});
    await db.collection('recipes').deleteMany({});
    const users = [
      { name: 'admin', email: 'root@email.com', password: 'admin', role: 'admin' },
      {
        name: 'Rômulo Franco',
        email: 'romulojosefranco@gmail.com',
        password: '987321',
        role: 'user',
      },
    ];
    await db.collection('users').insertMany(users);

    const recipes = [
      { name: 'bolo de caneca', ingredients: 'mistura pronta', preparation: 'aquecer no micro' },
      { name: 'banana com canela', ingredients: 'banana e canela', preparation: 'misturar ambos' },
    ];
    await db.collection('recipes').insertMany(recipes);
  });

  after(async () => {
    await connection.close();
  });

  describe('GET /recipes', () => {
    before(async () => {
      response = await chai.request(server)
        .get('/recipes')
        .send();
    })

    it('Testing data returned from GET of collection recipes', () => {
      chai.expect(response).to.have.status(200);
      chai.expect(response.body).to.be.a('array');
      chai.expect(response.body[0].name).to.be.an('string');
      chai.expect(response.body[0].ingredients).to.be.an('string');
      chai.expect(response.body[0].preparation).to.be.an('string');
    });
  });

  describe('POST /recipes', () => {
    it('Testing data returned with POST in the collection recipes', async () => {
      const token = await chai.request(server)
        .post('/login')
        .send({
          email: 'root@email.com',
          password: 'admin',
        })
        .then(({ body }) => body.token);

      response = await chai.request(server)
        .post('/recipes')
        .set('Authorization', token)
        .send(defaultRecipe);

      chai.expect(response).to.have.status(201);
      chai.expect(response.body.recipe.name).to.equal(defaultRecipe.name);
      chai.expect(response.body.recipe.ingredients).to.equal(defaultRecipe.ingredients);
      chai.expect(response.body.recipe.preparation).to.equal(defaultRecipe.preparation);
      chai.expect(response.body).to.be.a('object');
    });
  });

  describe('POST /recipes', () => {
    it('Testing data validation with POST in the collection recipes', async () => {
      const token = await chai.request(server)
        .post('/login')
        .send({
          email: 'root@email.com',
          password: 'admin',
        })
        .then(({ body }) => body.token);

      response = await chai.request(server)
        .post('/recipes')
        .set('Authorization', token)
        .send({
          name: 'banana com mel e granola',
          preparation: 'misturar todos ingredientes'
        });

      chai.expect(response).to.have.status(400);
      chai.expect(response.body).to.have.property('message');
      chai.expect(response.body).to.be.a('object');
      chai.expect(response.body.message).to.equal('Invalid entries. Try again.');
    });
  });

  describe('PUT /recipes', () => {
    it('Testing data returned with PUT in the collection recipes', async () => {
      const token = await chai.request(server)
        .post('/login')
        .send({
          email: 'root@email.com',
          password: 'admin',
        })
        .then(({ body }) => body.token);

      responsePostRecipe = await chai.request(server)
        .post(`/recipes/`)
        .set('Authorization', token)
        .send(defaultRecipe);

      response = await chai.request(server)
        .put(`/recipes/${responsePostRecipe.body.recipe._id}`)
        .set('Authorization', token)
        .send({
          name: 'banana sem mel e granola',
          ingredients: "banana",
          preparation: 'não misturar todos ingredientes'
        });

      chai.expect(response).to.have.status(200);
      chai.expect(response.body.name).to.equal('banana sem mel e granola');
      chai.expect(response.body.ingredients).to.equal('banana');
      chai.expect(response.body.preparation).to.equal('não misturar todos ingredientes');
      chai.expect(response.body).to.be.a('object');
    });
  });

  describe('PUT /recipes', () => {
    it('Testing data validation returned with PUT in the collection recipes', async () => {
      const token = await chai.request(server)
        .post('/login')
        .send({
          email: 'root@email.com',
          password: 'admin',
        })
        .then(({ body }) => body.token);

      responsePostRecipe = await chai.request(server)
        .post(`/recipes/`)
        .set('Authorization', token)
        .send(defaultRecipe);

      response = await chai.request(server)
        .put(`/recipes/${responsePostRecipe.body.recipe._id}`)
        .set('Authorization', token)
        .send({
          name: 'banana sem mel e granola',
          preparation: 'não misturar todos ingredientes'
        });

      chai.expect(response).to.have.status(400);
      chai.expect(response.body).to.have.property('message');
      chai.expect(response.body).to.be.a('object');
      chai.expect(response.body.message).to.equal('Invalid entries. Try again.');
    });
  });

  describe('UPDATE with normal user /recipes', () => {
    it('Testing data returned with UPDATE and normal user in the collection recipes', async () => {
      const token = await chai.request(server)
        .post('/login')
        .send({
          email: 'root@email.com',
          password: 'admin',
        })
        .then(({ body }) => body.token);

      responsePostRecipe = await chai.request(server)
        .post(`/recipes/`)
        .set('Authorization', token)
        .send(defaultRecipe);

      const newToken = await chai.request(server)
        .post('/login')
        .send({
          email: 'romulojosefranco@gmail.com',
          password: '987321',
        })
        .then(({ body }) => body.token);

      response = await chai.request(server)
        .put(`/recipes/${responsePostRecipe.body.recipe._id}`)
        .set('Authorization', newToken)
        .send(defaultRecipe);

      chai.expect(response).to.have.status(400);
      chai.expect(response.body.message).to.equal('Invalid data. Permission denied to edit');
    });
  });

  describe('DELETE with normal user /recipes', () => {
    it('Testing data returned with DELETE in the collection recipes', async () => {
      const token = await chai.request(server)
        .post('/login')
        .send({
          email: 'root@email.com',
          password: 'admin',
        })
        .then(({ body }) => body.token);

      responsePostRecipe = await chai.request(server)
        .post(`/recipes/`)
        .set('Authorization', token)
        .send(defaultRecipe);

      response = await chai.request(server)
        .delete(`/recipes/${responsePostRecipe.body.recipe._id}`)
        .set('Authorization', token)
        .send();

      chai.expect(response).to.have.status(204);
    });
  });


  describe('DELETE with normal user /recipes', () => {
    it('Testing data returned with DELETE and normal user in the collection recipes', async () => {
      const token = await chai.request(server)
        .post('/login')
        .send({
          email: 'root@email.com',
          password: 'admin',
        })
        .then(({ body }) => body.token);

      responsePostRecipe = await chai.request(server)
        .post(`/recipes/`)
        .set('Authorization', token)
        .send(defaultRecipe);

      const newToken = await chai.request(server)
        .post('/login')
        .send({
          email: 'romulojosefranco@gmail.com',
          password: '987321',
        })
        .then(({ body }) => body.token);

      response = await chai.request(server)
        .delete(`/recipes/${responsePostRecipe.body.recipe._id}`)
        .set('Authorization', newToken)
        .send();

      chai.expect(response).to.have.status(400);
      chai.expect(response.body.message).to.equal('Invalid data. Permission denied to remove');
    });
  });

  describe('GET ID /recipes', () => {
    it('Testing data returned with GET and ID in the collection recipes', async () => {
      const token = await chai.request(server)
        .post('/login')
        .send({
          email: 'root@email.com',
          password: 'admin',
        })
        .then(({ body }) => body.token);

      responsePostRecipe = await chai.request(server)
        .post(`/recipes/`)
        .set('Authorization', token)
        .send(defaultRecipe);

      response = await chai.request(server)
        .get(`/recipes/${responsePostRecipe.body.recipe._id}`)
        .send();

      chai.expect(response).to.have.status(200);
      chai.expect(response.body.name).to.be.an('string');
      chai.expect(response.body.ingredients).to.be.an('string');
      chai.expect(response.body.preparation).to.be.an('string');
    });
  });

  describe('PUT IMAGE /recipes', () => {
    it('Testing data with PUT of an IMAGE in the collection recipes', async () => {
      const photoFile = path.resolve(__dirname, '../uploads/ratinho.jpg');

      const token = await chai.request(server)
        .post('/login')
        .send({
          email: 'root@email.com',
          password: 'admin',
        })
        .then(({ body }) => body.token);

      responsePostRecipe = await chai.request(server)
        .post(`/recipes/`)
        .set('Authorization', token)
        .send(defaultRecipe);

      await chai.request(server)
        .put(`/recipes/${responsePostRecipe.body.recipe._id}/image`)
        .send(fs.readFileSync(photoFile))
        .set('Authorization', token)
        .set('Content-Type', 'image/jpeg')

      chai.expect(response).to.have.status(200);
    })
  });
});