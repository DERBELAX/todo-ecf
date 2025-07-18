const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const todoRoutes = require('../routes/todoRoutes');
const Todo = require('../models/Todo');

require('../setupTestBackend');

const app = express();
app.use(express.json());
app.use('/api/todos', todoRoutes);

beforeEach(async () => {
  await Todo.deleteMany();
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Integration - todoRoutes', () => {
  test('POST /api/todos crée une nouvelle tâche', async () => {
    const res = await request(app).post('/api/todos').send({ text: 'Faire les courses' });

    expect(res.statusCode).toBe(201);
    expect(res.body.text).toBe('Faire les courses');
    expect(res.body).toHaveProperty('_id');
  });

  test('GET /api/todos retourne les tâches', async () => {
    await Todo.create({ text: 'Préparer le test', completed: false });

    const res = await request(app).get('/api/todos');

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
    expect(res.body[0].text).toBe('Préparer le test');
  });

  test('PUT /api/todos/:id modifie une tâche', async () => {
    const todo = await Todo.create({ text: 'Tâche à cocher', completed: false });

    const res = await request(app)
      .put(`/api/todos/${todo._id}`)
      .send({ completed: true });

    expect(res.statusCode).toBe(200);
    expect(res.body.completed).toBe(true);
  });

  test('DELETE /api/todos/:id supprime une tâche (mock remove)', async () => {
    const fakeId = new mongoose.Types.ObjectId().toString();

    const mockTodo = {
      _id: fakeId,
      text: 'À supprimer',
      remove: jest.fn().mockResolvedValue({}),
    };

    jest.spyOn(Todo, 'findById').mockResolvedValue(mockTodo);

    const res = await request(app).delete(`/api/todos/${fakeId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Todo removed');
    expect(mockTodo.remove).toHaveBeenCalled();

    Todo.findById.mockRestore();
  });
  test('POST /api/todos sans texte retourne une erreur 400', async () => {
  const res = await request(app).post('/api/todos').send({});

  expect(res.statusCode).toBe(400);
  expect(res.body.message).toBeDefined();
});

});
