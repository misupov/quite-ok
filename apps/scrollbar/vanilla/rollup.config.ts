import html from "@rollup/plugin-html";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import { defineConfig } from "rollup";
import typescript from "rollup-plugin-typescript2";

export default defineConfig({
  input: "src/index.ts",
  output: {
    dir: "dist",
    format: "es",
    sourcemap: true,
  },
  plugins: [html(), nodeResolve(), typescript({ tsconfig: "tsconfig.json" })],
});
