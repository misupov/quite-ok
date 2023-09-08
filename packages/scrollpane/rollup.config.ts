import { defineConfig } from "rollup";
import typescript from "rollup-plugin-typescript2";
import url from "@rollup/plugin-url";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

export default defineConfig({
  input: "src/index.ts",
  output: {
    dir: "dist",
    format: "es",
    sourcemap: true,
  },
  plugins: [
    commonjs(),
    nodeResolve(),
    typescript({ tsconfig: "tsconfig.json" }),
    url({ limit: 1024 * 1024, include: ["**/*.svg", "**/*.cur"] }),
  ],
});
