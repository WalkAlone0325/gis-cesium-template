import { defineConfig } from 'unocss'

export default defineConfig({
  rules: [],
  shortcuts: {
    'main-box': 'absolute w-[--panel-width] h-full box-border z-999 grid gap-3 pt-3',
    'main': 'absolute w-full h-full top-0 left-0 z-9 before:absolute before:w-full before:h-full before:z-99 before:top-0 before:left-0 before:bg-[radial-gradient(circle,_transparent_20%,_#0c3753_80%)]'
  },
})
