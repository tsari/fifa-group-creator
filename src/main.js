import Vue from 'vue'
import App from './App.vue'

const VueResource = require('vue-resource');
const VeeValidate = require('vee-validate');
Vue.use(VueResource);
Vue.use(VeeValidate);

new Vue({
  el: '#app',
  render: h => h(App)
});
