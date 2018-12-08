<template>
    <div class="right">
        <!--聊天窗口-->
        <div>
            <div class="chat-person drag">
                <span>{{chatPerson.nickname}}</span>
            </div>
            <div class="chat-area" id="chat-area" @scroll.passive="scrollEvent">
                <ul>
                    <li v-for="(message,index) in messages">
                        <div v-if="index==0" class="more-info">
                            <span @click="showMore">查看更多消息</span>
                        </div>
                        <div v-if="index==0" class="oldest-time-area">
                            <span class="oldest-time">{{formatDate(message.createtime)}}</span>
                        </div>
                        <div v-if="index>0 && messages[index].createtime-messages[index-1].createtime > internalMills" class="oldest-time-area">
                            <span class="oldest-time">{{formatDate(message.createtime)}}</span>
                        </div>
                        <div class="img-msg" v-if="message.sendId==user.userId">
                            <a class="myself"><img v-bind:src="user.imgUrl"></a>
                            <div v-if="message.msgType==3">
                                <a class="myself-content" @click="imageEnlarge($event, message.destId)"><img :src="imgPrefix+'/'+message.content"></a>
                            </div>
                            <div v-if="message.msgType==0">
                                <span class="myself">{{message.content}}</span>
                            </div>
                        </div>
                        <div class="img-msg" v-else>
                            <a class="other-person"><img v-bind:src="chatPerson.imgUrl"></a>
                            <div v-if="message.msgType==3">
                                <a class="other-person-content" @click="imageEnlarge($event, message.destId)"><img :src="imgPrefix+'/'+message.content"></a>
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
                            <img @click="propFile" src="/static/img/file.png">
                        </span>
                        <span class="menu-item videa-chat">
                            <img  src="/static/img/video.png">
                        </span>
                    </div>
                    <div class="content" @keydown.delete="clearMsg" @paste.prevent="pasteImg" v-on:keydown.enter.prevent="sendMsg">
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
    import moment from 'moment'
    import lodash from 'lodash'
    import {remote} from 'electron'

    const client = remote.getGlobal('sharedObject').client

    export default {
        name: 'chat-area',
        computed: mapState({
            messages: 'messages',
            conversationMap: 'conversationMap',
            conversations: 'conversations',
            chatPerson: 'chatPerson',
            user: 'user',

        }),
        watch: {
            messages() {
                this.$nextTick(()=>{
                    let chatArea = document.getElementById('chat-area')
                    chatArea.scrollTop = chatArea.scrollHeight;
                })
            }
        },
        data() {
            return {
                imgPrefix: client.imgPrefix,
                internalMills: 5 * 60 * 1000,
                filepaths: [],
                message2send: '',
                showMoreFlag: true
            }
        },
        created: function() {
            dispatcher.processChat = response => {
                console.log('chatarea process')
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
                        destId: this.chatPerson.destId,
                        content: Buffer.from(data, 'binary'),
                        dataType: message_pb.CPrivateChat.DataType.IMG,
                        extName: filepath.substring(filepath.lastIndexOf('\.') + 1)
                    }
                    let bytes = msgBuilder.chatMessage(chatMsg)
                    client.conn.write(bytes)
                }
                if (!this.message2send || !this.chatPerson.destId)
                    return
                let chatMsg = {
                    userId: this.user.userId,
                    destId: this.chatPerson.destId,
                    content: this.message2send,
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
            propFile: function(){
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
            scrollEvent: lodash.debounce(function(){
                if (document.getElementById("chat-area").scrollTop <= 5 && !this.conversationMap[this.chatPerson.destId].scrollEnd) {
                    this.showMore()
                }
            }, 500),
            showMore() {
                let conversation = {'destId': this.chatPerson.destId, 'msgId': this.messages[0].msgId}
                this.showMoreFlag = !this.conversationMap[conversation.destId].scrollEnd
                let path = '/msg/historymessage/' + client.user.userId + '/' + conversation.destId + '/' + conversation.msgId + '/' + 20 + '?' + 'direct=-1'
                axios.get(path).then(res => {
                    let data = res.data
                    if (data == null || data.length == 0) {
                        this.conversationMap[conversation.destId].scrollEnd = true
                    } else {
                        let r = data.reverse()
                        let m = this.conversationMap[conversation.destId].messages = r.concat(this.conversationMap[conversation.destId].messages)
                        this.$store.commit('showMessage', m)
                    }
                    this.showMoreFlag = !this.conversationMap[conversation.destId].scrollEnd
                })
            },
            updateConversation(msg, sendToMe) {
                let destId = sendToMe ? msg.sendId : msg.destId
                let i=0
                for(i in this.conversations) {
                    if(this.conversations[i].destId === destId){
                        if(sendToMe) {
                            this.conversations[i].unreadCount += 1
                            if(destId === this.chatPerson.destId) {
                                this.notifyRead(this.conversations[i])
                            }
                        }
                        let conversation = this.conversations[i]
                        conversation.msgId = msg.msgId
                        conversation.lastMsg = msg.content
                        conversation.lastDate = this.formatDate(msg.createtime)
                        break
                    }
                }
                if(i > 0) {
                    let temp = this.conversations[i]
                    this.conversations[i] = this.conversations[0]
                    this.conversations[0] = temp
                }
                this.$store.commit('selectConversation', 0)
            },
            notifyRead(conversation) {
                let path = '/msg/notifyReaded?userId=' + this.user.userId + '&destId=' + this.chatPerson.destId
                if (conversation.unreadCount && conversation.unreadCount > 0) {
                    axios.get(path)
                    conversation.unreadCount = 0
                }
            },
            formatDate: function (c) {
                let curM = moment(c), copyM = moment(c)
                let now = moment().startOf('d')
                let diffNum = now.diff(copyM.startOf('d'), 'd')
                let format
                switch (diffNum) {
                    case 0:
                        format = curM.format('HH:mm')
                        break
                    case 1:
                        format = '昨天 ' + curM.format('HH:mm')
                        break
                    default:
                        format = curM.format('YYYY年MM月DD日 HH:mm')
                }
                return format
            },

        }

    }
</script>

<style>
    @import "/static/css/chat.css";

</style>