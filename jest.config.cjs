module.exports = {
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "ts-jest",
  },
  testPathIgnorePatterns: ["node_modules"],
  transformIgnorePatterns: ['/node_modules\/(?!my-package)(.*)'],
  testEnvironment: "jest-environment-jsdom",
};