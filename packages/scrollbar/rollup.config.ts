import { defineConfig } from "rollup";
import typescript from "rollup-plugin-typescript2";
import svg from "rollup-plugin-svg-import";

export default defineConfig({
  input: "src/index.ts",
  output: {
    dir: "dist",
    format: "es",
    sourcemap: true,
  },
  plugins: [
    typescript({ tsconfig: "tsconfig.json" }),
    svg({ stringify: true }),
  ],
});
