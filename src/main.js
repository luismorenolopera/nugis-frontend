import '@babel/polyfill'
import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import store from './store'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@fortawesome/fontawesome-free/css/all.css'
import VeeValidate from 'vee-validate'
import messages from '../node_modules/vee-validate/dist/locale/es'

Vue.config.productionTip = false

Vue.use(VeeValidate, {
  locale: 'es',
  dictionary: {
    es: messages
  }
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
