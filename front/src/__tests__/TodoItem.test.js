import { render, screen, fireEvent } from '@testing-library/react';
import TodoItem from '../components/TodoItem';

describe('TodoItem', () => {
  const mockToggle = jest.fn();
  const mockRemove = jest.fn();
  const sampleTodo = {
    _id: '123',
    text: 'Apprendre React',
    completed: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Affiche le texte de la tâche', () => {
    render(<TodoItem todo={sampleTodo} toggleTodo={mockToggle} removeTodo={mockRemove} />);
    const textElement = screen.getByText(/apprendre react/i);
    expect(textElement).toBeInTheDocument();
  });

  test('La case à cocher est décochée si `completed` est false', () => {
    render(<TodoItem todo={sampleTodo} toggleTodo={mockToggle} removeTodo={mockRemove} />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox.checked).toBe(false);
  });

  test('La case est cochée si `completed` est true', () => {
    const completedTodo = { ...sampleTodo, completed: true };
    render(<TodoItem todo={completedTodo} toggleTodo={mockToggle} removeTodo={mockRemove} />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox.checked).toBe(true);
  });

  test('Déclenche `toggleTodo` quand on clique sur la case', () => {
    render(<TodoItem todo={sampleTodo} toggleTodo={mockToggle} removeTodo={mockRemove} />);
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    expect(mockToggle).toHaveBeenCalledWith('123');
  });

  test('Déclenche `removeTodo` quand on clique sur Delete', () => {
    render(<TodoItem todo={sampleTodo} toggleTodo={mockToggle} removeTodo={mockRemove} />);
    const deleteButton = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(deleteButton);
    expect(mockRemove).toHaveBeenCalledWith('123');
  });
});
