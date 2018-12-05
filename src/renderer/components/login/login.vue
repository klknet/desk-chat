<template>
    <div class="container">
        <div class="login">
            <div class="row">
                <div class="col-sm-12">
                    <select v-model="userId" class="form-control">
                        <option v-for="option in options" v-bind:value="option.value">{{option.text}}</option>
                    </select>
                </div>
            </div>
            <div class="row">
                <div class="col-sm-12">
                    <input class="form-control" type="password" placeholder="密码" v-model="pwd">
                </div>
            </div>
            <div class="row">
                <div class="col-sm-12">
                    <div class="text-center">
                        <button class="btn btn-success" v-on:click="login">登录</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import msgBuilder from '../../../common/message_builder'
    import electron from 'electron'
    import dispatcher from '../../dispatcher'

    let client = electron.remote.getGlobal('sharedObject').client
    let modelData = {
        userId: '18062743820',
        pwd: 'konglk',
        options: [
            {text: '孔令凯', value: '18062743820', pwd: 'konglk'},
            {text: '秦田', value: '18062742155', pwd: 'qintian'},
            {text: '毛毛', value: '18510396861', pwd: 'maomao'},
            {text: '点点', value: '13477907301', pwd: 'diandian'}
        ]
    }

    dispatcher.processLogin = response => {
        console.log('login process')
        let resp = response.getResp();
        if (resp.getCode() == 200) {
            client.user.userId = resp.getUserid()
            client.user.certificate = resp.getCertificate()
            client.user.username = modelData.userId
            client.user.pwd = modelData.pwd
            client.loginFlag = true
            electron.ipcRenderer.send('index-show')
        }else {
            electron.remote.dialog.showErrorBox('error', '用户名密码错误')
        }
    }

    export default {
        name: 'login-page',
        data: function() {
            return modelData
        },
        methods: {
            login: function () {
                console.log('login')
                let bytes = msgBuilder.loginMessage(this.userId, this.pwd)
                client.conn.write(bytes)
            }
        },
        watch: {
            userId: function (val) {
                for (let i in this.options) {
                    if (this.options[i].value == val)
                        this.pwd = this.options[i].pwd
                }
            }
        }

    }
</script>

<style>
    @import url("https://cdn.bootcss.com/font-awesome/4.7.0/css/font-awesome.css");
    @import url("https://cdn.bootcss.com/bootstrap/4.1.1/css/bootstrap.min.css");
    .login{
        height: 100vh;
    }
    .login .row{
        padding-top: 30px;
    }
    .login-btn{
        background-color: #1AAD19;
        color:#ffffff;
        width:100px;
        padding:10px;
        text-align: center;
    }
</style>