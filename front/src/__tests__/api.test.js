import { getAllTodos, createTodo, updateTodo, deleteTodo } from '../services/api';

beforeEach(() => {
  global.fetch = jest.fn(); // mock global
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('API service', () => {
  test('GetAllTodos récupère les données correctement', async () => {
    const fakeData = [{ text: 'Test', completed: false }];
    fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(fakeData)
    });

    const result = await getAllTodos();

    expect(fetch).toHaveBeenCalledWith('http://localhost:5001/api/todos');
    expect(result).toEqual(fakeData);
  });

  test('CreateTodo envoie une requête POST avec le bon payload', async () => {
    const newTodo = { text: 'Créer un test' };
    const fakeResponse = { _id: '1', ...newTodo, completed: false };

    fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(fakeResponse)
    });

    const result = await createTodo('Créer un test');

    expect(fetch).toHaveBeenCalledWith('http://localhost:5001/api/todos', expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({ text: 'Créer un test' })
    }));
    expect(result).toEqual(fakeResponse);
  });

  test('UpdateTodo envoie une requête PUT avec les bonnes données', async () => {
    const updates = { completed: true };
    const response = { _id: '1', text: 'Test', completed: true };

    fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(response)
    });

    const result = await updateTodo('1', updates);

    expect(fetch).toHaveBeenCalledWith('http://localhost:5001/api/todos/1', expect.objectContaining({
      method: 'PUT',
      body: JSON.stringify(updates)
    }));
    expect(result).toEqual(response);
  });

  test('DeleteTodo envoie une requête DELETE', async () => {
  fetch.mockResolvedValueOnce({ status: 204 }); // Simule une réponse OK

  await deleteTodo('1'); 

  expect(fetch).toHaveBeenCalledWith(
    'http://localhost:5001/api/todos/1',
    expect.objectContaining({
      method: 'DELETE',
    })
  );
});


  test('Gèrer les erreurs réseau dans getAllTodos', async () => {
    fetch.mockRejectedValueOnce(new Error('Erreur réseau'));

    await expect(getAllTodos()).rejects.toThrow('Erreur réseau');
  });
});
