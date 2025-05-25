import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  target: "node18",
  outDir: "dist",
  clean: true,
  minify: true, // Set to true for production
  sourcemap: true,
  splitting: false,
  bundle: true,
  dts: true,
});
