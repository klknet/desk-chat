<template>
    <div class="left drag" id="nav-left">
        <ul class="non-drag">
            <li>
                <a>
                    <img id="profile" :src="user.imgUrl">
                </a>
            </li>
            <li>
                <a>
                    <img src="../assets/img/p1.png">
                </a>
            </li>
            <li>
                <a>
                    <img src="../assets/img/p2.png">
                </a>
            </li>
            <li>
                <a>
                    <img src="../assets/img/p3.png">
                </a>
            </li>
            <li>
                <a>
                    <img id="settings" src="../assets/img/p4.png">
                </a>
            </li>
        </ul>
    </div>
</template>

<script>
    import { mapState } from 'vuex'
    import axios from '../../common/request'
    import {remote} from 'electron'

    const client = remote.getGlobal('sharedObject').client
    export default {
        name: 'nav-left',
        computed: mapState({
            user: state => state.user
        }),
        created: function () {
            this.userProfile()
        },
        methods: {
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
    @import "../assets/css/navleft.css";
</style>