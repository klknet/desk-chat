import Vue from 'vue'
import store from './store/index'
import App from './App'

Vue.config.productionTip = false

new Vue({
    components: {App},
    store,
    template: '<App/>'
}).$mount('#app')
