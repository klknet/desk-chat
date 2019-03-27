import WebSocket from 'ws'
import electron from 'electron'

const client = {
    user: {},
    conn: new WebSocket("ws://localhost:8080/ims/ws/chat"),
    imgPrefix: 'http://39.106.133.40',
    loginFlag: false,//登录标识
    ping: function () {
        let s = setInterval(send, 1000 * 15)
        let that = this

        function send() {
            try {
                that.conn.send("ping")
            } catch (err) {
                console.error(err)
                clearInterval(s)
            }
        }
    },
    close: function () {
        if (this.conn) {
            this.conn.close()
        }
    },
    init: function () {

    },
}

client.conn.onopen = function (e) {
    console.log("Connected to websocket server")
    var ping = {
        type: 0,
        data: 'ping'
    }
    client.conn.send(JSON.stringify(ping))
    setInterval(()=>client.conn.send(JSON.stringify(ping)), 1000*15)
}

client.conn.onclose = function (e) {
    console.log("Disconnected")
}
client.conn.onerror = function (e) {
    console.log("Error eccured")
    
}

export default client;