<template>
    <div class="median drag" id="median">
        <div class="search">
            <i class="fa fa-search non-drag"></i>
            <input class="non-drag" id="search-input" type="text" placeholder=""/>
            <span class="add-friend non-drag">+</span>
        </div>
        <!--会话列表-->
        <div class="conversations non-drag">
            <ul>
                <li v-for="(conversation, index) in conversations" @click="clickConversationWin(conversation, index)"
                    v-bind:class="{active: selectIndex===index}">
                    <div>
                        <input type="hidden" :value="conversation.destId">
                        <input type="hidden" :value="conversation.msgId">
                        <span>
                            <img v-bind:src="conversation.imgUrl">
                            <a><span style="display: none;"
                                     v-bind:class="{badge: showBadge(conversation)}">
                                {{conversation.unreadCount>99?'99+':conversation.unreadCount}}
                            </span></a>
                        </span>
                        <span>
                            <span class="nickname">{{conversation.nickname}}</span>
                            <span class="last-date">{{conversation.lastDate}}</span>
                            <span class="last-msg">
                                <template v-if="conversation.msgType == 0">
                                    {{conversation.lastMsg}}
                                </template>
                                <template v-else>
                                    [图片]
                                </template>
                            </span>
                        </span>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    import axios from '../../../common/request'
    import {mapState} from 'vuex'
    import {remote} from 'electron'

    const client = remote.getGlobal('sharedObject').client
    export default {
        name: 'conversation-page',
        created() {
            this.conversationList()
        },
        computed: {
            ... mapState({
                conversations: 'conversations',
                conversationMap: 'conversationMap',
                chatPerson: 'chatPerson',
                user: 'user',
                selectIndex: 'selectIndex'
            }),
        },
        data() {
            return {}
        },
        methods: {
            //会话列表
            conversationList() {
                let url = '/conversation/conversationList/' + client.user.userId
                axios.get(url).then(res => {
                    let convs = res.data
                    if (convs.length > 0) {
                        this.$store.commit('conversationList', convs)
                        let conversationMap = {}
                        for (let i in convs) {
                            let conv = convs[i]
                            let info = conversationMap[conv.destId] = {}
                            Object.assign(info, conv)
                            info.messages = []//缓存当前会话历史消息，最多20条
                        }
                        this.$store.commit('conversationMap', conversationMap)
                    }
                })
            },
            //点击会话窗口
            clickConversationWin(conversation, index) {
                this.$store.commit('selectConversation', index)
                this.$store.commit('chatPerson', conversation)
                document.getElementById('sendArea').focus()
                this.notifyRead(conversation)
                if (this.conversationMap[conversation.destId].messages.length == 0) {
                    let path = '/msg/historymessage/' + client.user.userId + '/' + conversation.destId + '/' + conversation.msgId + '/' + 20 + '?' + 'direct=-2'
                    axios.get(path).then(res => {
                        let data = res.data
                        if (data == null || data == []) {
                            this.conversationMap[conversation.destId].messages.scrollEnd = true
                        } else {
                            let messages = this.conversationMap[conversation.destId].messages = data.reverse()
                            this.$store.commit('showMessage', messages)
                        }
                    })
                }
                else {
                    this.$store.commit('showMessage', this.conversationMap[conversation.destId].messages)
                    // vm.scrollToEnd()
                }
                // this.getMessageImages(conversation)
            },
            notifyRead(conversation) {
                let path = '/msg/notifyReaded?userId=' + this.user.userId + '&destId=' + this.chatPerson.destId
                if (conversation.unreadCount && conversation.unreadCount > 0) {
                    axios.get(path)
                    conversation.unreadCount = 0
                }
            },
            showBadge(conversation) {
                return (conversation.destId != this.chatPerson.destId) && (conversation.unreadCount > 0)
            },
        },
    }
</script>

<style>
    @import "/static/css/conversation.css";

</style>