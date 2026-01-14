import UnoCSS from 'unocss/vite'
import Vue from '@vitejs/plugin-vue'
import VueJsx from '@vitejs/plugin-vue-jsx'
import VueDevTools from 'vite-plugin-vue-devtools'
import Compression from 'vite-plugin-compression'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import type { PluginOption } from 'vite'

export default (_mode?: string, _command?: string): PluginOption[] => {
  return [
    Vue(),
    VueJsx(),
    VueDevTools(),
    UnoCSS() as PluginOption[],
    AutoImport({
      imports: ['vue', 'vue-router', 'pinia'],
      dts: 'types/auto-import.d.ts',
      eslintrc: {
        enabled: true,
        filepath: './.eslintrc-auto-import.json',
        globalsPropValue: true,
      },
      vueTemplate: true,
    }),
    Components({
      dts: 'types/components.d.ts',
      resolvers: [],
    }),
    Compression({
      algorithm: 'gzip',
      deleteOriginFile: false,
      ext: '.gz'
    })
  ]
}
