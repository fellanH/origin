import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["src/plugins/**/*.test.ts"],
  },
});
