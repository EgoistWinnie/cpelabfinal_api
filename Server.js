require('dotenv').config()
const express = require('express')
const bodyparser = require('body-parser')
const cors = require('cors')
const app = express()

// middleware section
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended: true}))
// mongodb+srv://therealwinnie:<password>@cluster0-zfzar.mongodb.net/test?retryWrites=true&w=majority
// Enable CORS
app.use(cors())
// app.use(function (req, res, next) {
//     //res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Origin", "http://localhost:3000");
//     res.header("Access-Control-Allow-Credentials", true);
//     res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
//     next();
// });


const Router = require('./Route')
app.use(Router)

const PORT = process.env.PORT || 5000
const HOSTNAME = process.env.HOSTNAME || "localhost"
app.listen(PORT,HOSTNAME, () => {
    console.log('Server is listening at:'+HOSTNAME+':'+PORT)
})