console.log('moduleA')

var time = console.log(new Date().getTime())
module.exports = {
    a() {
        console.log('module.a')
    },
    b() {
        console.log('module.b')
    },
    c() {
        console.log(time)
    }
};