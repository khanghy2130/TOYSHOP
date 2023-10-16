module.exports = {
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "ts-jest",
  },
  moduleDirectories: ['node_modules', '<rootDir>'],
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  testEnvironment: "jest-environment-jsdom",
};