const express = require('express');
const mongoose = require('../connectDB');
const app = express.Router();

const child=require('../models/childInfo');
const childName=require("../models/childrenNames");
const sessions =require("../models/session");

app.get("/getChildname",async(req,res)=>{
    try{
    const id=req.query.id;
    const name=await childName.findOne({id:id});  
    res.status(200).json(name);
    console.log("name"+name);

    }
    catch(error){
        res.status(500).json({ error: 'Internal Server Error' });
    }
    
});

app.get("/getChildrenSessions",async(req,res)=>{
    const id = req.query.id;
    
    const currentDate = new Date(); 
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);

    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
    try{
        const childSessions = await sessions.find({
            'childId':id,
            date: {
                $gte: firstDayOfMonth,
                $lte: lastDayOfMonth,
              },
            });
        if(childSessions.length >0 ){
            res.status(200).json(childSessions);
        }
        else{
            res.status(404).json({message:'no sessions found'});
        }
    }
    catch(error){
        res.status(500).json({ error: 'Internal Server Error' });
        console.log(error);
    }
});


module.exports = app;