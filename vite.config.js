import { defineConfig, loadEnv } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const apiProxy = {
    "/api": {
      target: env.VITE_API_PROXY_TARGET || "http://localhost:8080",
      changeOrigin: true,
    },
  };

  return {
    plugins: [react(), babel({ presets: [reactCompilerPreset()] })],
    server: { proxy: apiProxy },
    preview: { proxy: apiProxy },
  };
});
