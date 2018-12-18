import prepend from './prepend'
import uuid from 'uuid'
import message_pb from './message_pb'

let msg_builder = {
    loginMessage: function (userId, pwd) {
        const s1 = 'konglingkai'
        const s2 = 'qintiantian'
        let encodeUserId = new Buffer.from(s1+userId).toString('base64')
        let encodePwd = Buffer.from(s2+pwd).toString('base64')
        let message = new message_pb.ProtocolMessage()
        let req = new message_pb.ProtocolMessage.TRequest()
        req.setReqtype(message_pb.ProtocolMessage.RequestType.LOGIN)
        let clogin = new message_pb.CLogin()
        clogin.setMsgid(uuid.v1())
        clogin.setUserid(encodeUserId)
        clogin.setPwd(encodePwd)
        clogin.setDevicetype(message_pb.CLogin.DeviceType.WINDOWS)
        clogin.setTs(new Date().getTime())
        clogin.setVersion(1)
        req.setLogin(clogin)
        message.setRequest(req)
        let bytes = message.serializeBinary()
        return prepend.formFrame(bytes)
    },
    chatMessage: function (chatMsg) {
        let message = new message_pb.ProtocolMessage()
        let req = new message_pb.ProtocolMessage.TRequest()
        req.setReqtype(message_pb.ProtocolMessage.RequestType.CHAT)
        let chat = new message_pb.CPrivateChat()
        chat.setMsgid(uuid.v1())
        chat.setContent(Buffer.from(chatMsg.content))
        chat.setDestid(chatMsg.destId)
        chat.setUserid(chatMsg.userId)
        chat.setChattype(message_pb.CPrivateChat.ChatType.ONE2ONE)
        chat.setDatatype(chatMsg.dataType)
        chat.setConversationid(chatMsg.conversationId)
        req.setChat(chat)
        message.setRequest(req)
        let bytes = message.serializeBinary()
        return prepend.formFrame(bytes)
    },
    pingMessage: function () {
        let message = new message_pb.ProtocolMessage()
        let req = new message_pb.ProtocolMessage.TRequest()
        req.setReqtype(message_pb.ProtocolMessage.RequestType.PING)
        message.setRequest(req)
        let bytes = message.serializeBinary()
        return prepend.formFrame(bytes)
    }
}

export default msg_builder