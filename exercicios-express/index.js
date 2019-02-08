const express = require('express')
const app = express()

app.get(("/opa", (req, res) => {
    res.json([
        {id: 7, name:'ana', position:1},
        {ide: 34, name:'bia', position:2},
        {id: 73,name:'calos', position:3}
    ])

app.listen(3000, () => {
    console.log("backend executando...")
})