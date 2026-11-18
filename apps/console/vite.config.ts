import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// The .env file lives at the root of the monorepo.
const envDir = "../..";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, envDir, "");
  return {
    envDir,
    plugins: [react()],
    server: { port: Number(env.CONSOLE_PORT ?? 5173), strictPort: true },
  };
});
