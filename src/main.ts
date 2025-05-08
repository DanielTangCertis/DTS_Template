import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from "./router";

import "animate.css"; // 引入动画库
import "@/assets/scss/reset.scss";
import "@/assets/scss/global.scss";
import 'normalize.css'

const app =  createApp(App)
const pinia = createPinia()
app.use(pinia)
app.use(router)
app.mount('#app')