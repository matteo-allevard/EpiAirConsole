import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      provider: "v8",
      include: ["src/**/*.ts"],
      // Entry point: wiring only, covered by end-to-end tests later (E13-02).
      exclude: ["src/**/*.test.ts", "src/index.ts"],
      reporter: ["text", "lcov"],
      // Minimum coverage required for CI to pass. Raise it as the test suite grows.
      thresholds: { lines: 70, functions: 70, branches: 70, statements: 70 },
    },
  },
});
