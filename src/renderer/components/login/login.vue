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
    let client = electron.remote.getGlobal('sharedObject').client



    let modelData = {
        userId: '18062743820',
        pwd: 'konglk',
        options: [
            {text: '孔令凯', value: '18062743820', pwd: 'konglk'},
            {text: '秦田', value: '18062742155', pwd: 'qintian'},
            {text: '毛毛', value: '18510396861', pwd: 'maomao'},
        ]
    }

    electron.ipcRenderer.on('close-login-win', function () {
        // dispatcher.processLogin = (res) => console.log('login')
        var win = electron.remote.getCurrentWindow()
        win.webContents.closeDevTools()
        win.hide()
    })

    client.conn.onmessage = function (e) {
        var response = JSON.parse(e.data)
        switch (response.type) {
            case 0:
                break;
            case 1:
                if (response.code == 200) {
                    client.loginFlag = true
                    var user = JSON.parse(response.data)
                    client.user = user
                    electron.ipcRenderer.send('index-show')
                }else {
                    electron.remote.dialog.showErrorBox('error', response.message)
                }
        }
    }

    export default {
        name: 'login-page',
        data: function() {
            return modelData
        },
        created() {
        },
        methods: {
            login: function () {
                var d = {
                    unique: modelData.userId,
                    pwd: Buffer.from('konglk'+modelData.pwd).toString("base64")
                }
                var req = {
                    type: 1,
                    data: JSON.stringify(d)
                }
                client.conn.send(JSON.stringify(req))

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
</style>