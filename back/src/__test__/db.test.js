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
});
