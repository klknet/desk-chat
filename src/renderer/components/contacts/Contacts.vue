<template>
    <div>
        <div class="median drag" id="contacts">
            <div class="search non-drag">
                <div>
                    <i class="fa fa-search"></i>
                    <input class="search-input" type="text" placeholder="搜索"/>
                    <span class="add-friend">+</span>
                </div>
            </div>
            <div class="friend non-drag">
                <div class="contact-group">
                    <div class="group-title first">
                        <span>新的朋友</span>
                    </div>
                    <div class="group-content">
                        <ul>
                            <li @click="select(map[newFriendKey], newFriendKey)" :class="{active: s === map[newFriendKey]}">
                                <img class="avatar" src="static/img/newfriend.png"/>
                                <span class="notation">新的朋友</span>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="contact-group friend-group" v-for="(value,key) in user.groupFriend">
                    <div class="group-title">
                        <span>{{key}}</span>
                    </div>
                    <div class="group-content">
                        <ul>
                            <li v-for="(friend, index) in value" @click="select(map[friend.userId], friend.userId)"
                                :class="{active: s === map[friend.userId]}">
                                <img :src="friend.imgUrl" class="avatar"/>
                                <span class="notation">{{friend.notename}}</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <div class="right">
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
    import {mapState} from 'vuex'

    export default {
        name: 'contacts',
        computed: mapState({
            user: 'user',
        }),
        created() {
            let li_index = 0
            this.map[this.newFriendKey] = li_index++
            let friendGroup = this.user.groupFriend
            for (let group in friendGroup) {
                let friends = friendGroup[group]
                for (let i in friends) {
                    this.map[friends[i].userId] = li_index++
                }
            }
        },
        data() {
            return {
                s: -1,
                map: {},
                newFriendKey: 'new_friend_key',
            }
        },
        methods: {
            select(curI, key) {
                this.s = curI
                if(key === this.newFriendKey){
                    this.$router.push({path:'/contacts/new-friend/'})
                    return
                }
                for(let i in this.user.friends) {
                    if(key === this.user.friends[i].userId) {
                        this.$store.commit('selectFriend', i)
                        this.$router.push({path:'/contacts/friend-info'})
                    }
                }
            }
        }
    }
</script>

<style>
    .friend {
    }

    .friend .contact-group {
    }

    .group-title {
        padding: 12px 12px 0 12px;
        font-size: 0.8em;
        font-weight: 600;
        color: #999999;
    }

    .friend .first {
        font-size: 0.7em;
        font-weight: 600;
    }

    .contact-group:not(:first-child) {
        border-top: solid 1px #DAD9D9;
    }

    .friend li {
        padding: 12px;
        height: 58px;
        position: relative;
    }

    .friend li:hover {
        background-color: #DFDDDB;
    }

    .friend li.active {
        background-color: #CAC8C7;
    }

    .friend .avatar {
        width: 35px;
    }

    .friend .notation{
        padding-left: 8px;
    }


</style>