module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleDirectories: ["node_modules", "src"],
  transform: {
    ".+\\.ts$": "ts-jest",
  },
  testMatch: ["**/?(*.)+(unit.test|integration.test).ts"],
  moduleFileExtensions: ["ts", "js", "json"],
  maxWorkers: 1,
};