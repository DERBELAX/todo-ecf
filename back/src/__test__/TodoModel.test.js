const mongoose = require('mongoose');
const Todo = require('../models/Todo');

describe('Modèle Todo', () => {
  test('crée une tâche valide', () => {
    const todo = new Todo({ text: 'Lire un livre' });
    expect(todo.text).toBe('Lire un livre');
    expect(todo.completed).toBe(false);
    expect(todo.createdAt).toBeInstanceOf(Date);
  });

  test('trim automatiquement le texte', () => {
    const todo = new Todo({ text: '  avec espaces  ' });
    expect(todo.text).toBe('avec espaces');
  });

  test('rejette un todo vide', async () => {
    const todo = new Todo({});
    try {
      await todo.validate();
    } catch (err) {
      expect(err.errors.text).toBeDefined();
    }
  });

  test('completed est false par défaut', () => {
    const todo = new Todo({ text: 'Test' });
    expect(todo.completed).toBe(false);
  });

  test('createdAt est une date valide', () => {
    const todo = new Todo({ text: 'Date test' });
    expect(todo.createdAt).toBeInstanceOf(Date);
  });
});
