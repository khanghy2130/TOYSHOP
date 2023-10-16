module.exports = {
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": [
      "ts-jest", 
      {
        useESM: true,
      },
    ],
  },
  moduleDirectories: ['node_modules', '<rootDir>'],
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  testEnvironment: "jest-environment-jsdom",
};