import Vue from 'vue'
import vuex from 'vuex'
Vue.use(vuex);

const store = new vuex.Store({
    state: {
        user: {
            imgUrl: '',
            nickname: ''
        },//登录用户
        // conversations: [],//会话列表
        conversationMap: {},//存储每个会话相关的信息,
        chatPerson: {},//聊天对象
        messages: [],
        selectIndex: -1,//会话选中索引
    },
    mutations: {
        userProfile(state, user) {
            state.user = {...user}
        },
        conversationList(state, list) {
            state.conversations = list
        },
        conversationMap(state, map) {
            Object.assign(state.conversationMap, map)
        },
        chatPerson(state, conversation) {
            Object.assign(state.chatPerson, conversation)
        },
        showMessage(state, messages) {
            state.messages = messages
        },
        selectConversation(state, i) {
            state.selectIndex = i
        }
    }
})

export default store