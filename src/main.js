import Vue from 'vue'
import VueMeta from 'vue-meta'
import Buefy from 'buefy'
import PMOPublic from './PMOPublic.vue'
import VueMobileDetection from 'vue-mobile-detection';

import './scss/custom.scss';
import '@mdi/font/css/materialdesignicons.css';

Vue.config.productionTip = false
Vue.use(VueMeta);
Vue.use(Buefy);
Vue.use(VueMobileDetection);

Vue.prototype.$pmoInfo = {
  version: "1.0.11"
};

new Vue({
  render: h => h(PMOPublic),
}).$mount('#pmo-public')

if ('serviceWorker' in navigator) { 
  // register service worker 
  navigator.serviceWorker.register('/service-worker.js'); 
}