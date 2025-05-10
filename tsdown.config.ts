import { defineConfig } from "tsdown";

export default defineConfig({
  entry: [
    "./src/feed.ts",
  ],
  outDir: "./lib",
  sourcemap: true,
});
