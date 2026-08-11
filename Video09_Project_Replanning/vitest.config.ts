import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
    // No test files exist yet (see specs/2026-03-30-hello-hono); a later phase adds the first suite.
    passWithNoTests: true,
  },
});
