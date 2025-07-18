const mongoose = require('mongoose');
const connectDB = require('../config/db');

jest.mock('mongoose', () => ({
  connect: jest.fn()
}));

describe('DB config', () => {
  test('connecte à MongoDB avec succès', async () => {
    await connectDB();
    expect(mongoose.connect).toHaveBeenCalled();
  });


  test('affiche une erreur en cas d’échec', async () => {
    mongoose.connect.mockRejectedValueOnce(new Error('Connection failed'));
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    await connectDB();
    expect(consoleSpy.mock.calls[0][0]).toMatch(/impossible de se connecter/i);
    consoleSpy.mockRestore();
  });

  test('affiche un message de succès dans la console', async () => {
  const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  await connectDB();
  expect(consoleSpy).toHaveBeenCalledWith(expect.stringMatching(/succès/i));
  consoleSpy.mockRestore();
  });

  test('connectDB retourne une promesse', () => {
  const result = connectDB();
  expect(result).toBeInstanceOf(Promise);
  });


  test('appelle mongoose.connect avec le bon URI', async () => {
  await connectDB();

  const expectedURI = expect.stringMatching(/^mongodb\+srv:\/\/.*@.*\.mongodb\.net\/.*\?/);
  expect(mongoose.connect).toHaveBeenCalledWith(expectedURI, expect.any(Object));
});



});
