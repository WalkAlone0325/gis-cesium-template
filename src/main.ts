import 'virtual:uno.css'
import '@unocss/reset/normalize.css'
import '@/assets/styles/index.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import autofit from 'autofit.js'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')

autofit.init()
