const express = require('express')
const app = express()

const saudacao = require(./saudacaomid)

app.use(saudacao('guilherme'))
app.use((req, res, next) =>{
    console.log('antes...')
    next()
})
app.get('/cliente/id', (req,res) => {
    res.send(´cliente ${} selecionado)
})

app.get(("/opa", (req, res) => {
    res.json([
        data: [
            {id: 7, name:'ana', position:1},
            {id: 34, name:'bia', position:2},
            {id: 73, name:'calos', position:3}
        ],
        count:30,
        skip: 0,
        limit:3,
        status:200;
        
    })
    next()

app.use("/opa",(req, res) =>{
    console.log('sera que serei chamado?')
})

app.listen(3000, () => {
    console.log("backend executando...")
})