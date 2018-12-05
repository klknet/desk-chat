<template>
    <div>
        <template v-if="loginFlag">
            <main_page></main_page>
        </template>
        <template v-else>
            <login_page></login_page>
        </template>
    </div>
</template>

<script>
    import login_page from '@/components/login/login'
    import main_page from '@/components/MainWin'
    import {remote} from 'electron'

    let client = remote.getGlobal('sharedObject').client

    export default {
        name: 'desk-chat',
        data(){
            return {
                loginFlag: client.loginFlag
            }
        },
        components: {
            login_page, main_page
        }
    }
</script>

<style>
    /* CSS */
</style>
