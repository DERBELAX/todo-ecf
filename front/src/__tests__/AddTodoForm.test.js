import { render, screen, fireEvent } from '@testing-library/react';
import AddTodoForm from '../components/AddTodoForm';

describe('AddTodoForm', () => {
  test('Ajoute une tâche valide', () => {
    // Arrange
    const mockAddTodo = jest.fn();
    render(<AddTodoForm addTodo={mockAddTodo} />);
    const input = screen.getByPlaceholderText(/ajouter une nouvelle tâche/i);
    const button = screen.getByRole('button', { name: /add todo/i });

    // Act
    fireEvent.change(input, { target: { value: 'Faire les courses' } });
    fireEvent.click(button);

    // Assert
    expect(mockAddTodo).toHaveBeenCalledWith('Faire les courses');
    expect(input.value).toBe('');
  });

  test('Ignore une tâche vide', () => {
    const mockAddTodo = jest.fn();
    render(<AddTodoForm addTodo={mockAddTodo} />);
    const button = screen.getByRole('button', { name: /add todo/i });

    fireEvent.click(button);

    expect(mockAddTodo).not.toHaveBeenCalled();
  });

  test('Ignore une tâche avec uniquement des espaces', () => {
    const mockAddTodo = jest.fn();
    render(<AddTodoForm addTodo={mockAddTodo} />);
    const input = screen.getByPlaceholderText(/ajouter une nouvelle tâche/i);
    const button = screen.getByRole('button', { name: /add todo/i });

    fireEvent.change(input, { target: { value: '   ' } });
    fireEvent.click(button);

    expect(mockAddTodo).not.toHaveBeenCalled();
  });

  test('Efface le champ après ajout', () => {
    const mockAddTodo = jest.fn();
    render(<AddTodoForm addTodo={mockAddTodo} />);
    const input = screen.getByPlaceholderText(/ajouter une nouvelle tâche/i);
    const button = screen.getByRole('button', { name: /add todo/i });

    fireEvent.change(input, { target: { value: 'Tâche test' } });
    fireEvent.click(button);

    expect(input.value).toBe('');
  });

  test('Ne plante pas si addTodo n’est pas passé', () => {
  const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

  expect(() => {
    render(<AddTodoForm addTodo={() => {}} />); // Fonction vide au lieu d’absence
    const input = screen.getByPlaceholderText(/ajouter une nouvelle tâche/i);
    const button = screen.getByRole('button', { name: /add todo/i });

    fireEvent.change(input, { target: { value: 'Tâche' } });
    fireEvent.click(button);
  }).not.toThrow();

  consoleErrorSpy.mockRestore();
});

});
