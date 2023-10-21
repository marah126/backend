const express=require ('express');
const mongoose=require('../connectDB');
const app = express.Router();

//const bcrypt=require('bcrypt');

app.get("/hello",(req,res)=>{
    res.send("hhhiiiiii");
})

module.exports = app;
