const config = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/specs/**/*.spec.ts"],
  roots: ["<rootDir>/src"],
  transform: {
    "^.+\\.ts$": ["ts-jest", { tsconfig: "./tsconfig.json" }],
  },
};

export default config;
