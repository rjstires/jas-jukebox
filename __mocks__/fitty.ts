export default jest.fn().mockImplementation(() => ({
  unsubscribe: jest.fn(),
}));
