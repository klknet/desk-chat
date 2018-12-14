<template>
    <div class="main-win">
        <nav_left></nav_left>
        <router-view></router-view>
        <div class="func-area non-drag">
            <div>
                <span class="gray-bg" @click="minWin">-</span>
                <span class="gray-bg" @click="maxWin">□</span>
                <span class="red-bg" @click="closeWin">x</span>
            </div>
        </div>
    </div>
</template>

<script>
    import nav_left from './NavLeft'

    import {remote} from 'electron'

    export default {
        name: 'main-page',
        components: {
            nav_left
        },
        created: function () {
        },
        methods: {
            closeWin: function () {
                let curWin = remote.getCurrentWindow()
                curWin.close()
            },
            maxWin: function () {
                let curWin = remote.getCurrentWindow()
                curWin.isMaximized() ? curWin.unmaximize() : curWin.maximize()
            },
            minWin: function () {
                let curWin = remote.getCurrentWindow()
                curWin.isMinimized() ? curWin.restore() : curWin.minimize()
            },
        }
    }
</script>

<style>
    @import url('./../assets/css/main.css');
</style>