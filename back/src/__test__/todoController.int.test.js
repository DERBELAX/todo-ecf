const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Todo = require('../models/Todo');
const { getAllTodos, createTodo } = require('../controllers/todoController');
const httpMocks = require('node-mocks-http');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

afterEach(async () => {
  await Todo.deleteMany(); // Nettoyage
});

describe('Test d’intégration du controller Todo avec MongoDB', () => {
  test('création et récupération de todo', async () => {
    // CREATE
    const reqCreate = httpMocks.createRequest({
      method: 'POST',
      body: { text: 'Test MongoDB' }
    });
    const resCreate = httpMocks.createResponse();
    await createTodo(reqCreate, resCreate);
    expect(resCreate.statusCode).toBe(201);
    const createdTodo = resCreate._getJSONData();
    expect(createdTodo.text).toBe('Test MongoDB');

    // GET
    const reqGet = httpMocks.createRequest({ method: 'GET' });
    const resGet = httpMocks.createResponse();
    await getAllTodos(reqGet, resGet);
    const todos = resGet._getJSONData();
    expect(todos).toHaveLength(1);
    expect(todos[0].text).toBe('Test MongoDB');
  });
});
