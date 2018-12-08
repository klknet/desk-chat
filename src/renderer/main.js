import Vue from 'vue'
import store from './store/index'
import router from './router'
import App from './App'

Vue.config.productionTip = false

new Vue({
    components: {App},
    store,
    router,
    template: '<App/>'
}).$mount('#app')
