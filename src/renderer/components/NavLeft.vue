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
            this.$router.push(link[0])
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
                    this.$store.commit('userProfile', res.data)
                })
            }
        },
    }
</script>

<style>
    @import url("./../assets/css/navleft.css");
</style>