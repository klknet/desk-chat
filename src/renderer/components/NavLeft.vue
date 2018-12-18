<template>
    <div class="left drag" id="nav-left">
        <ul class="non-drag">
            <li>
                <a>
                    <img id="profile" :src="user.imgUrl">
                </a>
            </li>

            <li v-for="(m, index) in map" @click="select(index)">
                <a>
                    <img :src="format(m, index)">
                </a>
            </li>

            <li>
                <a>
                    <img id="settings" src="static/img/p4.png">
                </a>
            </li>
        </ul>
    </div>
</template>

<script>
    import {mapState} from 'vuex'
    import axios from '../../common/request'
    import {remote} from 'electron'
    import func from './../util/func'


    const client = remote.getGlobal('sharedObject').client
    let map = [
            ["p1", "p1-1"], ["p2", "p2-1"], ["p3", "p3-1"]
        ]
    let link = [
        {name: 'chat'}, {name: 'contacts'}, {name: 'collect'}
    ]
    export default {
        name: 'nav-left',
        computed: mapState({
            user: state => state.user
        }),
        data() {
            return {
                p: 0,
                map
            }
        },
        created: function () {
            console.log('nav-left')
            this.userProfile()
        },
        methods: {
            format(m, i) {
                return "static/img/" + m[i == this.p ? 0 : 1] + ".png"
            },
            select(i) {
                this.p = i
                this.$router.push(link[i])
            },
            userProfile() {
                let url = 'user/profile?userId=' + client.user.userId
                axios.get(url).then(res => {
                    func.groupFriend(res.data)
                    console.log('asyn-nav-left')
                    let conversationMap = {}
                    for (let i in res.data.conversations) {
                        let conv = res.data.conversations[i]
                        let info = conversationMap[conv.userId] = {}
                        Object.assign(info, conv)
                        info.messages = []//缓存当前会话历史消息，最多20条
                        info.scrollEnd = false
                    }
                    this.$store.commit('userProfile', res.data)
                    this.$store.commit('conversationMap', conversationMap)
                    this.$router.push(link[0])
                })
            }
        },
    }
</script>

<style>
    @import url("./../assets/css/navleft.css");
</style>