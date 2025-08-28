import { defineConfig } from "vite";
import { resolve } from "path";
import { fileURLToPath, URL } from "node:url";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    dts({
      insertTypesEntry: true,
      exclude: ["tests/**/*", "vitest.config.ts", "vite.config.ts"],
    }),
  ],
  build: {
    outDir: "dist",
    lib: {
      entry: resolve(
        fileURLToPath(new URL(".", import.meta.url)),
        "src/index.ts"
      ),
      name: "Iter",
      fileName: "iter",
      formats: ["es", "cjs", "umd"],
    },
    rollupOptions: {
      // Make sure to externalize deps that shouldn't be bundled
      external: [],
      output: {
        globals: {},
      },
    },
  },
});
