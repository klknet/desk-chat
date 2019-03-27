var WebSocket = require("ws")
var client = new WebSocket("ws://localhost:8080/ims/ws/chat")

client.onopen = function (e) {
    console.log("Connected to websocket server", e)
    client.send("hello world")
}
client.onmessage = function (e) {
    console.log("receive data", e.data)
}
client.onclose = function (e) {
    console.log("Disconnected")
}
client.onerror = function (ev) {
    console.log("Error eccured", ev.message)

}