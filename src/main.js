import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'

Vue.config.productionTip = false

var cesium = require('cesium/Cesium.js')
var widgets = require('cesium//Widgets/widgets.css')
Vue.prototype.cesium = cesium
Vue.prototype.widgets = widgets

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
