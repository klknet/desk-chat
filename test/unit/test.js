var objA = require('./moduleA')

objA.a = () => console.log('test a')
objA.a()
objA.c()

var objB = require('./moduleA')
objB.a()
objB.c()



