import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import TodoList from '../components/TodoList';
import * as api from '../services/api';

jest.mock('../services/api');

describe('TodoList', () => {
  const mockTodos = [
    { _id: '1', text: 'Lire un livre', completed: false },
    { _id: '2', text: 'Faire du sport', completed: true },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Affiche les tâches récupérées depuis l’API', async () => {
    api.getAllTodos.mockResolvedValueOnce(mockTodos);
    render(<TodoList />);
    expect(await screen.findByText(/lire un livre/i)).toBeInTheDocument();
    expect(screen.getByText(/Faire du sport/i)).toBeInTheDocument();
  });

  test('Ajoute une tâche et l’affiche', async () => {
    api.getAllTodos.mockResolvedValueOnce([]);
    api.createTodo.mockResolvedValueOnce({ _id: '3', text: 'Nouvelle tâche', completed: false });

    render(<TodoList />);
    const input = await screen.findByPlaceholderText(/ajouter une nouvelle tâche/i);
    const button = screen.getByRole('button', { name: /add todo/i });

    fireEvent.change(input, { target: { value: 'Nouvelle tâche' } });
    fireEvent.click(button);

    expect(await screen.findByText(/nouvelle tâche/i)).toBeInTheDocument();
  });

  test('Modifie une tâche (toggle)', async () => {
    api.getAllTodos.mockResolvedValueOnce(mockTodos);
    api.updateTodo.mockResolvedValueOnce({ ...mockTodos[0], completed: true });

    render(<TodoList />);
    const checkboxes = await screen.findAllByRole('checkbox');
    fireEvent.click(checkboxes[0]);

    await waitFor(() => {
      expect(api.updateTodo).toHaveBeenCalledWith('1', { completed: true });
    });
  });

  test('Supprime une tâche', async () => {
    api.getAllTodos.mockResolvedValueOnce(mockTodos);
    api.deleteTodo.mockResolvedValueOnce();

    render(<TodoList />);
    const deleteButtons = await screen.findAllByRole('button', { name: /delete/i });
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(api.deleteTodo).toHaveBeenCalledWith('1');
    });
  });
  test('Affiche un message si la liste des todos est vide', async () => {
  api.getAllTodos.mockResolvedValueOnce([]); // cas sans erreur, juste vide

  render(<TodoList />);
  
  expect(await screen.findByText(/todo list/i)).toBeInTheDocument();
  
  const items = screen.queryAllByRole('listitem');
  expect(items.length).toBe(0); // la liste est vide
});



});
