import Vue from 'vue'
import VueRouter from 'vue-router'
import Chat from './components/chat/Chat'
import Contacts from './components/contacts/Contacts'
import Collect from './components/collect/Collect'

Vue.use(VueRouter)

const routes = [
    {path: '/chat', name: 'chat', component: Chat},
    {path: '/contacts', name: 'contacts', component: Contacts},
    {path: '/collect', name: 'collect', component: Collect}
]

const router = new VueRouter({
    routes
})

export default router