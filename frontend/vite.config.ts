/**
 * @file vite.config.ts
 * @description Configuração do Vite.
 *
 * Correção aplicada: a propriedade `resolve.tsconfigPaths` não é nativa do Vite
 * e era silenciosamente ignorada, fazendo com que o alias `@/*` definido no
 * tsconfig.json nunca fosse aplicado ao bundler. O alias é agora declarado
 * explicitamente em `resolve.alias`, mantendo paridade com o tsconfig.json.
 */

import path from "path";
import { defineConfig } from "vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { nitro } from "nitro/vite";

const config = defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  plugins: [
    devtools(),
    nitro({ rollupConfig: { external: [/^@sentry\//] } }),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
  ],
});

export default config;