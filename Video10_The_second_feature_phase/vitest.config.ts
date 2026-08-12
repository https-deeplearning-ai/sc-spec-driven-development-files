import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    setupFiles: ["./tests/setup.ts"],
  },
  oxc: {
    transform: {
      jsxImportSource: "hono/jsx",
    },
  },
});
