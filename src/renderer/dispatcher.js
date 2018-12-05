import electron from 'electron'
import message_pb from '../common/message_pb'

let client = electron.remote.getGlobal('sharedObject').client

client.conn.on("data", function (bytes) {
    let message = message_pb.ProtocolMessage.deserializeBinary(bytes)
    let response = message.getResponse()
    switch (response.getResptype()) {
        case  message_pb.ProtocolMessage.RequestType.LOGIN:
            dispatcher.processLogin(response)
            break
        case message_pb.ProtocolMessage.RequestType.PONG:
            dispatcher.processPong(response)
            break
        case message_pb.ProtocolMessage.RequestType.CHAT:
            dispatcher.processChat(response);
            break
    }
})

const dispatcher = {
    processChat(response) {
        console.log('dispatcher process chat')
    },
    processLogin(res) {
        console.log('dispatcher process login')
    },
    processPong(res) {
        console.log('pong')
    }
}

export default dispatcher