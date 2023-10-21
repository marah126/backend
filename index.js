const express =require('express');
const connection = require("./connectDB");
const route=require('./crud/s.js');
const route2=require('./crud/login.js');



const app=express();

app.use(express.urlencoded({extended : true}));
app.use(express.json());

app.use('/sanad',route);
app.use('/sanad',route2);


module.exports=app;
