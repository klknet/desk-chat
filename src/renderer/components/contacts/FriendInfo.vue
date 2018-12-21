<template>
    <div class="friend-info drag">
        <div class="info-chunk non-drag top">
            <div>
                <div>
                    <span class="nickname">{{friend.nickname}}</span>
                    <template v-if="friend.sex != undefined">
                        <img class="sex" :src="friend.sex==0 ? 'static/img/female.png' : 'static/img/male.png'"/>
                    </template>
                </div>
                <div style="padding-top: 5px;">
                    <span>{{friend.signature}}</span>
                </div>
            </div>
            <div>
                <img class="info-img" :src="friend.imgUrl"/>
            </div>
        </div>
        <div class="info-chunk non-drag">
            <div>
                <div class="detail-row">
                    <span class="detail-title">备&nbsp;&nbsp;&nbsp;注</span>
                    <span class="detail-value">{{friend.notename}}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-title">地&nbsp;&nbsp;&nbsp;区</span>
                    <span class="detail-value">{{friend.city}}</span>
                </div>
                <div>
                    <span class="detail-title">聊天号</span>
                    <span class="detail-value">{{friend.username}}</span>
                </div>
            </div>
        </div>
        <div class="info-chunk non-drag">
            <div class="text-center">
                <button class="info-send" @click="sendMessage">发消息</button>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapState} from 'vuex'
    import axios from '../../../common/request'
    import func from './../../util/func'
    import qs from 'qs'

    export default {
        name: 'friend-info',
        computed: mapState({
            user: 'user',
            navIndex: 'navIndex',
            friend: state => {
                if(state.friendIndex == -1)
                    return {}
                return state.user.friends[state.friendIndex]
            }
        }),
        data() {
            return {
            }
        },
        created() {

        },
        methods: {
            sendMessage() {
                let userId = this.friend.userId
                for(let i in this.user.conversations) {
                    if(this.user.conversations[i].userId == userId) {
                        console.log('已存在的会话')
                        this.$store.commit('selectNav', 0)
                        this.$store.commit('selectConversation', parseInt(i))
                        this.$store.commit('chatPerson', this.user.conversations[i])
                        this.$router.push({name:'chat'})
                        return
                    }
                }
                let data ={
                    userId: this.user.userId,
                    destId: userId
                }
                axios.post('conversation/create', qs.stringify(data),
                    {headers: { 'Content-Type': 'application/x-www-form-urlencoded' }}).then(res => {
                    func.groupFriend(res.data)
                    for(let i in res.data.conversations) {
                        if(res.data.conversations[i].userId === userId) {
                            this.$store.commit('selectConversation', parseInt(i))
                        }
                    }
                    this.$store.commit('selectNav', 0)
                    this.$store.commit('userProfile', res.data)
                    this.$router.push({name:'chat'})
                })
            }
        }
    }
</script>

<style>
    .friend-info .info-img {
        width: 60px;
    }

    .friend-info {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-top: 50px;
    }

    .info-chunk {
        width: 350px;
        padding: 35px 0;
    }

    .top {
        display: flex;
        justify-content: space-between;
    }

    .info-chunk:not(.top) {
        border-top: solid 1px #DAD9D9;
    }

    .friend-info .nickname {
        font-weight: 700;
        font-size: 1.2em;
    }

    .friend-info .sex {
        width: 25px;
    }

    .friend-info .detail-title {
        color: #999999;
        display: inline-block;
        width: 70px;
    }

    .friend-info .detail-value {
    }

    .info-chunk .info-send {
        width: 140px;
        color: #ffffff;
        background-color: #1AAD19;
        border: 0;
        padding: 6px 0;
    }

    button.info-send:hover {
        cursor: pointer;
        background-color: #129611;
    }
</style>