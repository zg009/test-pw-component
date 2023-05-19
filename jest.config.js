/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  "roots": [
    "<rootDir>/src"
  ],
  "testRegex": '/test/.*\\.test\\.ts$',
  "transform": {
    "^.\\.(ts|tsx)$": "ts-jest"
  },
  testEnvironment: 'node',
};