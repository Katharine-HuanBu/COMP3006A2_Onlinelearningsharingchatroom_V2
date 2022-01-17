import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from "./util/http";
import Vueaxios from 'vue-axios'
import api from './api/index'
Vue.config.productionTip = false
import preview from 'vue-photo-preview'
import 'vue-photo-preview/dist/skin.css'
let options = {
  fullscreenEl: false
};
Vue.use(preview, options)
Vue.use(preview)
Vue.use(Vueaxios, axios);
Vue.prototype.$api = api;
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
