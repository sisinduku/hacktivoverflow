// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import axios from 'axios'
import BootstrapVue from 'bootstrap-vue'
import store from './vuex/store'
import wysiwyg from 'vue-wysiwyg'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'vue-wysiwyg/dist/vueWysiwyg.css'

Vue.use(BootstrapVue)
Vue.use(wysiwyg, {
  image: {
    uploadURL: '/api/myEndpoint'
  },
  hideModules: {
    'table': true,
    'image': true
  }
})

Vue.prototype.$http = axios.create({
  baseURL: 'https://overflow.mepawz.com'
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {
    App
  }
})
