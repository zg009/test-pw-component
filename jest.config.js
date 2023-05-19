/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  "testRegex": "/test/.*\\.test\\.ts$",
  "transform": {
    "^.\\.(ts|tsx)$": "ts-jest"
  },
  testEnvironment: 'node',
  preset: "ts-jest"
};