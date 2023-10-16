module.exports = {
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": [
      "ts-jest/presets/default-esm", 
      {
        useESM: true,
      },
    ],
  },
  moduleDirectories: ['node_modules', '<rootDir>'],
  extensionsToTreatAsEsm: ['.js', '.jsx', '.ts', '.tsx'],
  testEnvironment: "jest-environment-jsdom",
};