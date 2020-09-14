import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import router from './router';
import { store } from './store/store'
import axios from 'axios';

Vue.config.productionTip = false

axios.interceptors.request.use(config => {
  let token = localStorage.getItem("access_token");
  if(token != null){
    config.headers.common["Authorization"] = `Bearer ${token}`;
  }
  return config;
})

axios.interceptors.response.use(function (response){
  return response;
}, function (error){
  if(401 == error.response.status){
    console.log("401")
    store.dispatch("destroyCurrentUser");
  }
  return Promise.reject(error)
})

new Vue({
  vuetify,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
