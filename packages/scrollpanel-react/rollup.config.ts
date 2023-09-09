import { defineConfig } from "rollup";
import typescript from "rollup-plugin-typescript2";

export default defineConfig({
  input: "src/index.ts",
  output: {
    dir: "dist",
    format: "es",
    sourcemap: true,
  },
  cache: false,
  external: ["react", "react/jsx-runtime", "@quite-ok/scrollpanel"],
  plugins: [typescript({ tsconfig: "tsconfig.json" })],
});
