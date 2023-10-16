module.exports = {
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": [
      "ts-jest", {
        useESM: true,
      },
    ],
  },

  // preset: 'ts-jest/presets/default-esm',
  // resolver: 'ts-jest-resolver',

  //moduleDirectories: ['node_modules', '<rootDir>'],
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  testEnvironment: "jest-environment-jsdom",
};