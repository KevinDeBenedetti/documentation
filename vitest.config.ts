import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";
import { defineVitestProject } from "@nuxt/test-utils/config";

export default defineConfig(async () => ({
  resolve: {
    alias: {
      "#shared": fileURLToPath(new URL("./shared", import.meta.url)),
      "~": fileURLToPath(new URL("./", import.meta.url)),
      "@": fileURLToPath(new URL("./", import.meta.url)),
    },
  },
  test: {
    projects: [
      {
        test: {
          name: "unit",
          include: ["test/unit/*.{test,spec}.ts"],
          environment: "node",
        },
      },
      await defineVitestProject({
        test: {
          name: "nuxt",
          include: ["test/nuxt/*.{test,spec}.ts"],
          environment: "nuxt",
          environmentOptions: {
            nuxt: {
              rootDir: fileURLToPath(new URL(".", import.meta.url)),
              domEnvironment: "happy-dom",
            },
          },
        },
      }),
    ],
    reporters: process.env.GITHUB_ACTIONS
      ? ["default", "github-actions"]
      : ["default"],
    coverage: {
      enabled: true,
      provider: "v8",
      reporter: ["text", "json", "html", "json-summary"],
      include: ["shared/**/*.ts", "server/**/*.ts"],
      exclude: [
        "**/*.config.ts",
        "**/*.d.ts",
        "**/test/**",
        "**/node_modules/**",
        "**/coverage/**",
        "**/*.vue",
        "server/api/**/*.ts", // Uses Nuxt globals, tested via nuxt environment
        "shared/types/**/*.ts", // Type definitions only, no executable code
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
  },
}));
