import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from '@/store'

import '@/plugins/vant.js'

import '@/assets/css/base.css'
import '@/assets/css/iconfont.css'


import axios from 'axios'
axios.defaults.baseURL = 'http://101.43.20.130'
Vue.prototype.$http = axios

import Transfrom from '@/assets/js/transform.js'
import PhyTouch from '@/assets/js/phyTouch.js'
Vue.prototype.Transfrom = Transfrom
Vue.prototype.PhyTouch = PhyTouch

var VueTouch = require('vue-touch')
Vue.use(VueTouch, { name: 'v-touch' })

import _ from 'lodash'
Vue.prototype._ = _

Vue.config.productionTip = false




axios.interceptors.request.use(req => {
  var date = new Date()
  if (req.url.lastIndexOf('?') == -1) {
    req.url += '?t=' + date.getTime()
  } else {
    req.url += '&t=' + date.getTime()
  }
  return req
})

new Vue({
  store,
  router,
  render: h => h(App),
}).$mount('#app')
