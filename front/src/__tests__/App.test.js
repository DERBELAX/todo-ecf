import { render, screen } from '@testing-library/react';
import App from '../App';

test('affiche le titre principal My Todo App', () => {
  render(<App />);
  const titleElement = screen.getByText(/my todo app/i); 
  expect(titleElement).toBeInTheDocument();
});

