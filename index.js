const express =require('express');
const connection = require("./connectDB");
const route=require('./crud/s.js');
const route2=require('./crud/login.js');
const route3=require('./crud/calendar.js');


const app=express();

app.use(express.urlencoded({extended : true}));
app.use(express.json());

app.use('/sanad',route);
app.use('/sanad',route2);
app.use('/sanad',route3);


module.exports=app;
