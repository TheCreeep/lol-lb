import { createApp } from 'vue'
import store from './store.js'
import 'vue3-toastify/dist/index.css';

import App from './App.vue'

const app = createApp(App)

app.use(store)

app.mount('#app')
