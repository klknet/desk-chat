<template>
    <div>
        <div class="median drag" id="contacts">
            <div class="search">
                <i class="fa fa-search non-drag"></i>
                <input class="non-drag" id="search-input" type="text" placeholder=""/>
                <span class="add-friend non-drag">+</span>
            </div>
            <div  class="friend non-drag">
                <ul>
                    <li v-for="(friend, index) in user.friends" @click="select(index)" :class="{active: s === index}">
                        <img :src="friend.imgUrl" class="friend-img"/>
                        <span class="friend-notename">{{friend.notename}}</span>
                    </li>
                </ul>
            </div>
        </div>
        <div class="right">

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
        data() {
            return {
                s: -1
            }
        },
        methods: {
            select(i) {
                this.s = i
            }
        }
    }
</script>

<style>
    .friend li {
        padding: 10px;
        height: 58px;
        position: relative;
    }
    .friend li:hover {
        background-color: #DFDDDB;
    }
    .friend li.active {
        background-color: #CAC8C7;
    }
    .friend-img{
        width:40px;
    }
    .friend-notename {

    }
</style>