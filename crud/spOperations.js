const express = require('express');
const mongoose = require('../connectDB');
const app = express.Router();

const note=require('../models/sessionNotes');
const sessions=require("../models/session");
const child=require('../models/childInfo');
app.post("/addNotes",async(req,res)=>{
    try{
        newNote=note({
            idd:req.body.id,
            specialest:req.body.specialest,
            session:req.body.session,
            date:Date(),
            personalNotes:req.body.personalNotes,
            spNotes:req.body.spNotes,
            parentsNotes:req.body.parentsNotes,
        });
        const savedNote=await newNote.save();
        console.log(savedNote);
        res.status(200).json(savedNote);

    }
    catch(error){
        console.log(error);
        res.json(error);
    }
});

app.get("/getchnameSP",async(req,res)=>{
    try{
        const sp=req.query.sp;
        const result= await child.find({'sessions.specialest': sp},'idd firstName lastName');
        res.json(result);
        for(let i=0; i<result.length;i++){
            console.log(result[i]);
        }
    }
    catch(error){
        console.error('Error getting children names:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
    
});


module.exports = app;