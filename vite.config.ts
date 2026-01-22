import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import createPlugins from './vite/plugins'

// https://vite.dev/config/
export default defineConfig(({ mode, command }) => {
  const env = loadEnv(mode, process.cwd())

  return {
    base: command === 'build' ? env.VITE_APP_BASE : '/',
    css: {},
    plugins: createPlugins(mode, command),
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '#': fileURLToPath(new URL('./types', import.meta.url))
      },
    },
    server: {
      host: true,
      port: Number(env.VITE_PORT),
      open: true,
      proxy: {
        [env.VITE_BASE_URL]: {
          target: env.VITE_API_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(new RegExp(`^${env.VITE_BASE_URL}`), ''),
        },
      },
    },
  }
})
