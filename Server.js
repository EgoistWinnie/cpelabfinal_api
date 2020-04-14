require('dotenv').config()
const express = require('express')
const bodyparser = require('body-parser')



const app = express()

// middleware section
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended: true}))
// mongodb+srv://therealwinnie:<password>@cluster0-zfzar.mongodb.net/test?retryWrites=true&w=majority


const Router = require('./Route')
app.use(Router)

const PORT = process.env.PORT
const HOSTNAME = process.env.HOSTNAME
app.listen(PORT,HOSTNAME, () => {
    console.log('Server is listening at:'+HOSTNAME+':'+PORT)
})