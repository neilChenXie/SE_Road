import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)
app.provide('globalData', 'Provide/Inject in Vue3')
app.mount('#app')
