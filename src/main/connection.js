import msgBuilder from '../common/message_builder'
import config from '../config/settings'
import net from 'net'

const client = {
    user: {
        userId: '',
        username: '',
        pwd: '',
        certificate: ''
    },
    conn: null,
    imgPrefix: 'http://39.106.133.40',
    host: config.host,
    chat_port: '8090',
    loginFlag: false,//登录标识
    ping: function () {
        let s = setInterval(send, 1000 * 15)
        let that = this

        function send() {
            try {
                that.conn.write(msgBuilder.pingMessage())
            } catch (err) {
                console.error(err)
                clearInterval(s)
            }
        }
    },
    close: function () {
        if (this.conn) {
            this.conn.destroy()
        }
    },
    init: function () {
        console.log('init')
        let that = this
        if (!this.conn) {
            this.conn = new net.Socket()
        }
        this.conn.connect(this.chat_port, this.host, function () {
            console.log("connection to server")
            that.ping()
        })
    }
}

export default client;