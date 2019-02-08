function saudacao() {

    return function (req, res, next) {
        console.log(`seja bem vindo ${nome}.`)
        next()
    }
}

module.exports = saudacao