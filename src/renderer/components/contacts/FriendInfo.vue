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

    export default {
        name: 'friend-info',
        computed: mapState({
            user: 'user',
        }),
        data() {
            return {
                friend: {}
            }
        },
        created() {
            this.friend = this.user.friends[this.$route.params.index]
        },
        methods: {
            sendMessage() {

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
        font-weight: 600;
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