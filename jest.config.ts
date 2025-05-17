module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleDirectories: ["node_modules", "src"],
  transform: {
    ".+\\.ts$": "ts-jest",
  },
  testMatch: ["**/?(*.)+(spec|unit.test).ts"],
  moduleFileExtensions: ["ts", "js", "json"],
  roots: ["<rootDir>/src"],
  maxWorkers: 1,
};