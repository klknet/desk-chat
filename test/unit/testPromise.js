function multipy(input) {
    return new Promise((resolve, reject) => {
        console.log('calculating %d X %d ...', input, input)
        setTimeout(resolve, 500, input*input)
    })
}

function add(input) {
    return new Promise((resolve, reject) => {
        console.log('calculating %d + %d ...', input, input)
        setTimeout(resolve, 500, input+input)
    })
}


var p = new Promise(function (resolve, reject) {
    console.log('start new promise')
    resolve(8)
})

p.then(multipy).then(add).then(result => {
    console.log('result is %d', result)
    return result
}).then(res => {
    console.log(res)
})