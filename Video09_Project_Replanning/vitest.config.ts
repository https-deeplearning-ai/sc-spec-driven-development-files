import { defineConfig } from "vitest/config";

export default defineConfig({
  esbuild: {
    jsxImportSource: "hono/jsx",
  },
  test: {
    include: ["src/**/*.test.{ts,tsx}"],
  },
});
