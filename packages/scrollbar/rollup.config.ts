import { defineConfig } from "rollup";
import typescript from "rollup-plugin-typescript2";
import svg from "rollup-plugin-svg-import";
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
    svg({ stringify: true }),
  ],
});
