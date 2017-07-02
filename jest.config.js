module.exports = {
  moduleNameMapper: {
    '\\.scss$': '<rootDir>/sources/__mocks__/styleMock.jsx',
  },
  automock: false,
  setupFiles: [
    './setupJest.js',
  ],
};
