const express = require('express');
const mongoose = require('../connectDB');
const app = express.Router();


const chNames = require("../models/childrenNames");
const spNames = require("../models/specialestNames");
const sessions =require("../models/session");
const child=require("../models/childInfo");

app.delete("/deleteChildrenNames",async(req,res)=>{
    try {
        // Use the signup model to delete all documents
        const result = await spNames.deleteMany({});
        
        // Check if any documents were deleted
        if (result.deletedCount > 0) {
          res.status(200).json({ message: `${result.deletedCount} documents deleted from 'signup' collection.` });
        } else {
          res.status(404).json({ message: 'No documents found to delete.' });
        }
      } catch (error) {
        console.error('Error deleting documents:', error);
        res.status(500).json({ error: 'Internal server error.' });
      }
});

// -------------- add child namen (now it is not used here) ---------------------------//
app.post("/addchname",async(req,res)=>{
    try{
        const fname=req.body.fname;
        const lname=req.body.lname;
        const id =req.body.id;
        const newChName=chNames();
        newChName.Fname=fname;
        newChName.Lname=lname;
        newChName.id=id;
        await newChName.save();
        res.json(newChName);
    }
    catch(error){
        console.error('Error adding child name:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
   
});
// -----------------get children names ----------------------//
app.get("/getchname",async(req,res)=>{
    try{
        const result= await chNames.find({});
        if(result.length>0){
            res.status(200).json(result);
            for(let i=0; i<result.length;i++){
                console.log(result[i].Fname+" "+result[i].Lname);
            }
        }
        else{
            res.status(404).json({message:"no data"});
            console.log("No data");
        }
        
    }
    catch(error){
        console.error('Error getting children names:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
    
});

//--------------- add specialest name (now it is not used here )------------------//
app.post("/addspname",async(req,res)=>{
    try{
        const fname=req.body.fname;
        const lname=req.body.lname;
        const id=req.body.id;
        const newspName=spNames();
        newspName.Fname=fname;
        newspName.Lname=lname;
        newspName.id=id;
        await newspName.save();
        res.json(newspName);
    }
    catch(error){
        console.error('Error adding specialest name:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// ----------------get specialests names---------------//
app.get("/getspname",async(req,res)=>{
    try{
        const result= await spNames.find({});
        res.json(result);
        for(let i=0; i<result.length;i++){
            console.log(result[i].Fname+" "+result[i].Lname);
        }
    }
    catch(error){
        console.error('Error gitting specialest name:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
    
});
// -------------------- get all the sesssions fro calender(admin) ----------------------------
app.get("/getallsessions",async(req,res)=>{
    try{
        const result=await sessions.find({});
        res.json(result);
        for(let i=0;i<result.length;i++){
            console.log(result[i]);
        }
    }
    catch(error){
        console.error('Error gettting all sessions for calender:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
// --------------------- add session from calender (admin) -------------------------
app.post("/addsession",async(req,res)=>{
    try{
        const newSession=sessions();
        newSession.idd=parseInt(req.body.id);
        newSession.child=req.body.child;
        newSession.specialest=req.body.specialest;
        newSession.session=req.body.session;
        newSession.date=req.body.date;
        newSession.endMonth=req.body.endMonth;
        newSession.day=req.body.day;
        newSession.childId="";
        newSession.spId="";

        await newSession.save();
        res.json(newSession);
        console.log(newSession);
    }
    catch(error){
        console.error('Error adding session for calender:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
    
    
});
// ------------ get the session of today fro admin ----------------------------------------
app.get("/getTodaySessions",async(req,res)=>{
    try{
        const today = new Date();
        const day=today.getDay();
        const month =today.getMonth();
        const year=today.getFullYear();
        console.log(day);
        console.log(month);
        console.log(year);
        const todaySessions= await sessions.find({
            day: day,
            date: {
              $gte: new Date(year, month, 1), // Start of the target month
              $lt: new Date(year, month + 1, 1), // Start of the next month
            },
          });

          const sortedSessions = todaySessions.sort((a, b) => {
            const timeA = getTimePart(a.date);
            const timeB = getTimePart(b.date);
            return timeA.localeCompare(timeB);
          });
          console.log( todaySessions);
         // res.json(todaySessions);

          console.log(sortedSessions);
          res.json(sortedSessions);
        
          function getTimePart(date) {
            return date.toISOString().split('T')[1].substring(0, 5);
          }


    }catch(error){
        console.log(error);
    }
});

app.delete("/deleteSessions",async(req,res)=>{
    const todaySessions= await sessions.deleteMany();
    res.json(todaySessions);
});

app.get("/getTODAYSessionsBySP",async(req,res)=>{
    try{
        const sp=req.query.sp;
        console.log(sp);
        const today = new Date();
        const day=today.getDay();
        const month =today.getMonth();
        const year=today.getFullYear();
        console.log(day);
        console.log(month);
        console.log(year);
        const todaySessions= await sessions.find({
            specialest:sp,
            day: day-1,
            date: {
              $gte: new Date(year, month, 1), // Start of the target month
              $lt: new Date(year, month + 1, 1), // Start of the next month
            },
          });
        res.json(todaySessions);
    }catch(error){
        console.log(error);
    }

})

module.exports = app;