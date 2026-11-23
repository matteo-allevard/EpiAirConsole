import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      provider: "v8",
      include: ["src/**/*.ts"],
      // Re-export barrels only: nothing to test.
      exclude: ["src/**/*.test.ts", "src/**/index.ts"],
      reporter: ["text", "lcov"],
      // Same minimum as the server workspace. Raise it as the test suite grows.
      thresholds: { lines: 70, functions: 70, branches: 70, statements: 70 },
    },
  },
});
