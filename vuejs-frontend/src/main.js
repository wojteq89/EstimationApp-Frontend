import Vue from 'vue';
import App from './App.vue';
import router from './router';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';
import VueNotification from 'vue-notification';
import '@mdi/font/css/materialdesignicons.css';
import '@/styles/style.scss'
import '@/styles/variables.scss'

Vue.use(Vuetify);
Vue.use(VueNotification);

new Vue({
  vuetify: new Vuetify(),
  router,
  render: h => h(App)
}).$mount('#app');
