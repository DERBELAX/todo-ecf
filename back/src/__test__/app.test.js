const request = require('supertest');
const mongoose = require('mongoose');
const { app, closeServer } = require('../app'); 
const Todo = require('../models/Todo');

beforeEach(async () => {
  await Todo.deleteMany(); // Nettoyage base
});

afterAll(async () => {
  await mongoose.connection.close(); // Fermeture Mongo
  await closeServer(); 
});

describe('Intégration serveur Express', () => {
  test('GET /api/todos retourne un tableau vide', async () => {
    const res = await request(app).get('/api/todos');

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });

  test('POST /api/todos crée une tâche', async () => {
    const res = await request(app)
      .post('/api/todos')
      .send({ text: 'Tâche test' });

    expect(res.statusCode).toBe(201);
    expect(res.body.text).toBe('Tâche test');
    expect(res.body).toHaveProperty('_id');
  });

  test('PUT /api/todos/:id modifie une tâche', async () => {
    const todo = await Todo.create({ text: 'À faire', completed: false });

    const res = await request(app)
      .put(`/api/todos/${todo._id}`)
      .send({ completed: true });

    expect(res.statusCode).toBe(200);
    expect(res.body.completed).toBe(true);
  });

 test('POST /api/todos retourne une erreur si le champ text est vide', async () => {
  const res = await request(app).post('/api/todos').send({});

  expect(res.statusCode).toBe(400); 
  expect(res.body.message).toBeDefined();
});


  test('POST /api/todos retourne 400 si texte manquant', async () => {
    const res = await request(app)
      .post('/api/todos')
      .send({});

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBeDefined();
  });
});
