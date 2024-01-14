const express = require('express');
const mongoose = require('../connectDB');
const app = express.Router();

const note=require('../models/sessionNotes');
const sessions=require("../models/session");
const child=require('../models/childInfo');
const spName=require('../models/specialestNames');
const spInfo=require("../models/specialestInfo");
const login = require("../models/login");
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

app.get("/getsppnename",async(req,res)=>{
    try{
    const id=req.query.id;
    const name=await spName.findOne({id:id});  
    res.status(200).json(name);
    console.log("name"+name);

    }
    catch(error){
        res.status(500).json({ error: 'Internal Server Error' });
    }
    

});

app.get("/getEmail",async(req,res)=>{
    try{
        const id =req.query.id;
        const email= await login.findOne({cid:id});
        console.log(email);
        if(email !== null ){
            res.status(200).json(email);
        }
        else{
            res.status(404).json({message:"not found"});
        }

    }catch(error){
        res.status(500).json({ error: 'Internal Server Error' });
        console.log(error);
    }
});

app.put("/updateEmail", async (req, res) => {
    try {
        const id = req.query.id;
        const newEmail = req.body.newEmail;

        // Update the document with the new email
        const result = await login.updateOne({ cid: id }, { $set: { email: newEmail } });
        console.log(result);
        if (result.modifiedCount > 0) {
            res.status(200).json({ message: "Email updated successfully" });
        } else {
            res.status(404).json({ message: "Document not found or email is the same" });
        }
        
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
        console.log(error);
    }
});
module.exports = app;