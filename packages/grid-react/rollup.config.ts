import { defineConfig } from "rollup";
import typescript from "rollup-plugin-typescript2";

export default defineConfig({
  input: "src/index.ts",
  output: {
    dir: "dist",
    format: "es",
    sourcemap: true,
  },
  external: [
    "react",
    "react-dom/client",
    "react/jsx-runtime",
    "@quite-ok/grid",
  ],
  plugins: [typescript({ tsconfig: "tsconfig.json" })],
});
