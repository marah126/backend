const express =require('express');
const connection = require("./connectDB");
const route=require('./crud/s.js');
const route2=require('./crud/login.js');
const route3=require('./crud/calendar.js');
const route4=require('./crud/childInfo.js');
const route5=require('./crud/specialestInfo.js');
const route6=require('./crud/spOperations.js');




const app=express();

app.use(express.urlencoded({extended : true}));
app.use(express.json());

app.use('/sanad',route);
app.use('/sanad',route2);
app.use('/sanad',route3);
app.use('/sanad',route4);
app.use('/sanad',route5);
app.use('/sanad',route6);


module.exports=app;
