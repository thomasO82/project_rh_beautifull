const express = require("express")
const mongoose = require("mongoose")
const session = require("express-session")
const companyRouter = require("./routes/companyRouter")
const employeeRouter = require("./routes/employeeRouter")
require("dotenv").config()

const app = express()
app.use(express.static('assets'))
app.use(session({secret: process.env.SECRET_SESSION, resave: false, saveUninitialized: true}))
app.use(express.urlencoded({extended: true}))
app.use(function (req, res, next){
    res.locals.session = req.session
    next()
})
app.use(companyRouter)
app.use(employeeRouter)

app.listen(process.env.PORT,(err)=>{
    if (err) {
        console.log(err);
    }else{
        console.log("You are connected on the port " + process.env.PORT);
    }
})

mongoose.set('strictQuery', true)
mongoose.connect(process.env.URL_BDD,(err)=>{
    if (err) {
        console.log(err);
    }else{
        console.log("connecté a mongodb");
    }
})



