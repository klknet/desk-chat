<template>
    <div class="right">
        <!--聊天窗口-->
        <div>
            <div class="chat-person drag">
                <span>{{chatPerson.notename}}</span>
            </div>
            <div class="chat-area" id="chat-area" @scroll.passive="scrollEvent">
                <ul>
                    <li v-for="(message,index) in messages">
                        <div v-if="index==0" class="more-info">
                            <span @click="showMore" v-show="showMoreFlag">查看更多消息</span>
                        </div>
                        <div v-if="index==0" class="oldest-time-area">
                            <span class="oldest-time">{{formatDate(message.ts)}}</span>
                        </div>
                        <div v-if="index>0 && messages[index].ts-messages[index-1].ts > internalMills"
                             class="oldest-time-area">
                            <span class="oldest-time">{{formatDate(message.ts)}}</span>
                        </div>
                        <div class="img-msg" v-if="message.sendId==user.userId">
                            <a class="myself"><img v-bind:src="user.imgUrl"></a>
                            <div v-if="message.msgType==3">
                                <a class="myself-content" @click="imageEnlarge($event, message.destId)"><img
                                        :src="imgPrefix+'/'+message.content"></a>
                            </div>
                            <div v-if="message.msgType==0">
                                <span class="myself">{{message.content}}</span>
                            </div>
                        </div>
                        <div class="img-msg" v-else>
                            <a class="other-person"><img v-bind:src="chatPerson.imgUrl"></a>
                            <div v-if="message.msgType==3">
                                <a class="other-person-content" @click="imageEnlarge($event, message.destId)"><img
                                        :src="imgPrefix+'/'+message.content"></a>
                            </div>
                            <div v-if="message.msgType==0">
                                <span class="other-person">{{message.content}}</span>
                            </div>
                        </div>
                        <div class="clear"></div>
                    </li>
                </ul>
            </div>
            <div class="send-area">
                <div class="content-area">
                    <div class="menu-area">
                        <span class="menu-item">
                            <img @click="propFile" src="static/img/file.png">
                        </span>
                        <span class="menu-item videa-chat">
                            <img src="static/img/video.png">
                        </span>
                    </div>
                    <div class="content" @keydown.delete="clearMsg" @paste.prevent="pasteImg"
                         v-on:keydown.enter.prevent="sendMsg">
                        <div class="img-area">
                            <ul>
                                <li v-for="filepath in filepaths">
                                    <img :src="filepath">
                                </li>
                            </ul>
                        </div>
                        <textarea id="sendArea" v-model="message2send"></textarea>
                    </div>
                </div>
                <div class="">
                    <button v-on:click="sendMsg" class="send-btn"><span>发送(S)</span></button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from '../../../common/request'
    import {mapState} from 'vuex'
    import message_pb from '../../../common/message_pb'
    import msgBuilder from '../../../common/message_builder'
    import dispatcher from '../../dispatcher'
    import fs from 'fs'
    import lodash from 'lodash'
    import {remote} from 'electron'
    import func from '../../util/func'

    const client = remote.getGlobal('sharedObject').client

    export default {
        name: 'chat-area',
        computed: {
            ...mapState({
                conversationMap: 'conversationMap',
                chatPerson: 'chatPerson',
                user: 'user',
                messages: state => {
                    if(!state.chatPerson.userId || !state.conversationMap[state.chatPerson.userId])
                        return []
                    return state.conversationMap[state.chatPerson.userId].messages
                },
                showMoreFlag: state => {
                    return !state.conversationMap[state.chatPerson.userId].scrollEnd
                }
            }),
        },
        watch: {
            messages() {
                this.scrollEnd()
            },
            chatPerson() {
                this.scrollEnd()
            }
        },
        data() {
            return {
                imgPrefix: client.imgPrefix,
                internalMills: 5 * 60 * 1000,
                filepaths: [],
                message2send: '',
            }
        },
        created: function () {
            // console.log(dispatcher.processLogin)
            dispatcher.processChat = response => {
                let chat = response.getChat()
                let decoder = new TextDecoder('utf8')
                let m = {
                    "sendId": chat.getUserid(),
                    "destId": chat.getDestid(),
                    "content": decoder.decode(chat.getContent_asU8()),
                    "createtime": chat.getTs(),
                    "msgId": chat.getMsgid(),
                    "msgType": chat.getDatatype()

                }
                let sendToMe = m.sendId != client.user.userId  //是否是别人发给我的消息
                let destId = sendToMe ? m.sendId : m.destId
                let recMsg = this.conversationMap[destId].messages
                //每个会话只缓存100条消息
                while (recMsg.length > 99) {
                    recMsg.shift()
                }
                recMsg.push(m)
                //有新消息时更新会话列表，不用请求服务器
                this.updateConversation(m, sendToMe)
                if (sendToMe) {
                    // vm.flash()
                }
            }
        },
        methods: {
            sendMsg: function () {
                for (let i in this.filepaths) {
                    let filepath = this.filepaths.shift()
                    let data = fs.readFileSync(filepath, 'binary')
                    let chatMsg = {
                        userId: this.user.userId,
                        destId: this.chatPerson.userId,
                        content: Buffer.from(data, 'binary'),
                        dataType: message_pb.CPrivateChat.DataType.IMG,
                        extName: filepath.substring(filepath.lastIndexOf('\.') + 1)
                    }
                    let bytes = msgBuilder.chatMessage(chatMsg)
                    client.conn.write(bytes)
                }
                if (!this.message2send || !this.chatPerson.userId)
                    return
                let chatMsg = {
                    userId: this.user.userId,
                    destId: this.chatPerson.userId,
                    content: this.message2send,
                    conversationId: this.conversationMap[this.chatPerson.userId].conversation.conversationId,
                    dataType: message_pb.CPrivateChat.DataType.TXT
                }
                let bytes = msgBuilder.chatMessage(chatMsg)
                client.conn.write(bytes)
                this.message2send = ''
            },
            clearMsg: function () {

            },
            pasteImg: function () {

            },
            chatMessages: function () {

            },
            imageEnlarge: function () {

            },
            propFile: function () {
                let that = this
                remote.dialog.showOpenDialog(remote.getCurrentWindow(), {
                    filters: [
                        {name: '图片', extensions: ['jpg', 'png', 'gif']},
                        {name: '所有文件（*.*）', extensions: ['*']}],
                    properties: ['openFile', 'multiSelections']
                }, function (filePaths) {
                    if (filePaths) {
                        that.filepaths = that.filepaths.concat(filePaths)
                    }
                    document.getElementById('sendArea').focus()
                });
            },
            scrollEvent: lodash.debounce(function () {
                if (document.getElementById("chat-area").scrollTop <= 5 && !this.conversationMap[this.chatPerson.userId].scrollEnd) {
                    this.showMore()
                }
            }, 500),
            showMore() {
                if (!this.showMoreFlag || this.messages.length == 0) {
                    return
                }
                let conversationObj = this.conversationMap[this.chatPerson.userId];
                let path = '/msg/messages?userId=' + client.user.userId + '&conversationId='
                    + conversationObj.conversation.conversationId + '&msgId=' + this.messages[0].msgId + '&self=0'
                axios.get(path).then(res => {
                    let data = res.data
                    if (data == null || data.length == 0) {
                        conversationObj.scrollEnd = true
                    } else {
                        let r = data.reverse()
                        conversationObj.messages = r.concat(conversationObj.messages)
                    }
                    this.$store.commit('conversationMap', this.conversationMap)
                })
            },
            updateConversation(msg, sendToMe) {
                let destId = sendToMe ? msg.sendId : msg.destId
                let i = 0
                let conversations = this.user.conversations
                for (i in conversations) {
                    if (conversations[i].userId === destId) {
                        if (sendToMe) {
                            conversations[i].unreadCount += 1
                            if (destId === this.chatPerson.userId) {
                                this.notifyRead(conversations[i])
                            }
                        }
                        let conversation = conversations[i]
                        conversation.msgId = msg.msgId
                        conversation.lastMsg = msg.content
                        conversation.lastDate = msg.createtime
                        break
                    }
                }
                if (i > 0) {
                    let temp = conversations[i]
                    conversations[i] = conversations[0]
                    conversations[0] = temp
                }
                this.$store.commit('selectConversation', 0)
            },
            notifyRead(conversation) {
                let path = '/msg/notifyReaded?userId=' + this.user.userId + '&destId=' + this.chatPerson.userId
                if (conversation.unreadCount && conversation.unreadCount > 0) {
                    axios.get(path)
                    conversation.unreadCount = 0
                }
            },
            formatDate(c) {
                return func.formatDate(c)
            },
            scrollEnd() {
                this.$nextTick(() => {
                    let chatArea = document.getElementById('chat-area')
                    chatArea.scrollTop = chatArea.scrollHeight;
                })
            }

        }

    }
</script>

<style>
    @import "./../../assets/css/chat.css";

</style>