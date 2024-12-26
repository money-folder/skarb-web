module.exports = jest.fn().mockReturnValue({
  handlers: jest.fn(),
  signIn: jest.fn(),
  signOut: jest.fn(),
  auth: jest.fn(),
});
