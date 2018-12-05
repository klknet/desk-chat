<template>
    <div class="main-win">
        <nav_left></nav_left>
        <conversation></conversation>
        <chat_area></chat_area>
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
    import conversation from './Conversation'
    import chat_area from './ChatArea'

    import {remote} from 'electron'

    export default {
        name: 'main-page',
        components: {
            nav_left, conversation, chat_area
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
    /* 设置滚动条的样式 */
    ::-webkit-scrollbar {
        width: 7px;
        margin-left:2px;
    }

    /* 滚动条滑块 */
    ::-webkit-scrollbar-thumb {
        border-radius: 6px;
        background-color: #D2D2D2;
    }

    ::-webkit-scrollbar-thumb:window-inactive {
        background:rgba(255,0,0,0.4);
        display: none;
    }

    li, ul, div {
        margin: 0;
        padding: 0
    }

    li {
        list-style: none;
    }

    input, select, option, textarea, button {
        outline: none;
    }

    .drag {
        -webkit-app-region: drag;
    }

    .non-drag {
        -webkit-app-region: no-drag;
    }

    .main-win {
        position: relative;
    }

    .func-area {
        display: inline;
        position: absolute;
        right: 0;
        top: 0;
        z-index: 1000;
        line-height: 5px;
    }

    .red-bg, .gray-bg {
        padding: 10px;
        cursor: pointer;
        display: inline-block;
        font-size: 1.2em;
    }

    .red-bg:hover {
        background-color: #F45454;
        color: #ffffff;
    }

    .gray-bg:hover {
        background-color: #E3E3E3;
    }

</style>