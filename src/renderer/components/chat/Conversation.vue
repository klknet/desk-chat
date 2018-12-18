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
                <li v-for="(conversation, index) in user.conversations" @click="clickConversationWin(conversation, index)"
                    v-bind:class="{active: conversationIndex===index}">
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
                            <span class="nickname">{{conversation.notename}}</span>
                            <span class="last-date">{{formatDate(conversation.lastDate)}}</span>
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
    import func from '../../util/func'

    const client = remote.getGlobal('sharedObject').client
    export default {
        name: 'conversation-page',
        created() {
        },
        computed: {
            ... mapState({
                conversationMap: 'conversationMap',
                chatPerson: 'chatPerson',
                user: 'user',
                conversationIndex: 'conversationIndex'
            }),
        },
        data() {
            return {
            }
        },
        methods: {
            //点击会话窗口
            clickConversationWin(conversation, index) {
                this.$store.commit('selectConversation', index)
                this.$store.commit('chatPerson', conversation)
                // document.getElementById('sendArea').focus()
                this.notifyRead(conversation)
                if(!conversation.msgId) {
                    return
                }
                if (!this.conversationMap[conversation.userId] ||this.conversationMap[conversation.userId].messages.length == 0) {
                    let path = '/msg/messages?userId=' + client.user.userId + '&conversationId=' +
                        conversation.conversationId+'&msgId='+conversation.msgId+"&self=1"
                    axios.get(path).then(res => {
                        let data = res.data
                        if (data == null || data == []) {
                            this.conversationMap[conversation.userId].scrollEnd = true
                        } else {
                            let messages = this.conversationMap[conversation.userId].messages = data.reverse()
                        }
                        this.$store.commit('conversationMap', this.conversationMap)
                    })
                }

            },
            notifyRead(conversation) {
                let path = '/msg/notifyReaded?userId=' + this.user.userId + '&destId=' + this.chatPerson.userId
                if (conversation.unreadCount && conversation.unreadCount > 0) {
                    axios.get(path)
                    conversation.unreadCount = 0
                }
            },
            showBadge(conversation) {
                return (conversation.userId != this.chatPerson.userId) && (conversation.unreadCount > 0)
            },
            formatDate(c) {
                return func.formatDate(c)
            }
        },
    }
</script>

<style>
    @import "./../../assets/css/conversation.css";

</style>