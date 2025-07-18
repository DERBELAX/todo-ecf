const mongoose = require('mongoose');
const Todo = require('../models/Todo');
const controller = require('../controllers/todoController');

jest.mock('../models/Todo');

describe('📦 todoController (unit tests)', () => {
  let req, res;

  beforeEach(() => {
    req = {};
    res = {
      json: jest.fn(),
      status: jest.fn(() => res),
    };
  });

  test('getAllTodos retourne tous les todos', async () => {
    const todos = [{ text: 'Test' }];
    jest.spyOn(Todo, 'find').mockReturnValue({
      sort: jest.fn().mockResolvedValue(todos),
    });

    await controller.getAllTodos(req, res);

    expect(res.json).toHaveBeenCalledWith(todos);
  });

  test('createTodo crée un todo', async () => {
    req.body = { text: 'Nouvelle tâche' };

    const saveMock = jest.fn().mockResolvedValue({ _id: '1', text: 'Nouvelle tâche' });
    Todo.mockImplementation(() => ({ save: saveMock }));

    await controller.createTodo(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ _id: '1', text: 'Nouvelle tâche' });
  });

  test('updateTodo met à jour un todo existant', async () => {
    req.params = { id: '123' };
    req.body = { completed: true };

    const todo = {
      completed: false,
      save: jest.fn().mockResolvedValue({ completed: true }),
    };

    Todo.findById.mockResolvedValue(todo);

    await controller.updateTodo(req, res);

    expect(todo.completed).toBe(true);
    expect(res.json).toHaveBeenCalledWith({ completed: true });
  });

  test('updateTodo retourne 404 si le todo est introuvable', async () => {
    req.params = { id: 'invalide' };
    Todo.findById.mockResolvedValue(null);

    await controller.updateTodo(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Todo not found' });
  });
});
