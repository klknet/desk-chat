import Vue from 'vue'
import VueRouter from 'vue-router'
import Chat from './components/chat/Chat'
import Contacts from './components/contacts/Contacts'
import FriendInfo from './components/contacts/FriendInfo'
import NewFriend from './components/contacts/NewFriend'
import Collect from './components/collect/Collect'

Vue.use(VueRouter)

const routes = [
    {path: '/chat', name: 'chat', component: Chat},
    {
        path: '/contacts', name: 'contacts', component: Contacts,
        children: [
            {
                path:'friend-info/:index',
                component: FriendInfo
            },
            {
                path:'new-friend/:key',
                component: NewFriend
            }
        ]
    },
    {path: '/collect', name: 'collect', component: Collect},
]

const router = new VueRouter({
    routes
})

export default router