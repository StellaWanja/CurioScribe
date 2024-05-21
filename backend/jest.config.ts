/**  @type {import('@jest/types').Config.ProjectConfig} */
const config = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/**/*.test.ts"],
  verbose: true,
  forceExit: true,
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
  moduleDirectories: ["node_modules", "src"],
  transform: {
    "^.+\\.(t|j)s$": "ts-jest",
  },
  moduleNameMapper: {
    "^(\.\.?\/.+)\.js?$": "$1"
  },
  modulePaths: ["<rootDir>"],
  moduleFileExtensions: ["js", "json", "ts"],
  roots: ["src"],
};

export default config;
