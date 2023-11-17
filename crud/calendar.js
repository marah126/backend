const express = require('express');
const mongoose = require('../connectDB');
const app = express.Router();
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

const chNames = require("../models/childrenNames");
const spNames = require("../models/specialestNames");
const sessions =require("../models/session");
app.post("/addchname",async(req,res)=>{
    const fname=req.body.fname;
    const lname=req.body.lname;
    const newChName=chNames();
    newChName.Fname=fname;
    newChName.Lname=lname;
    newChName.id=null;
    await newChName.save();
    res.json(newChName);
});

app.get("/getchname",async(req,res)=>{
    const result= await chNames.find({},'Fname Lname');
    res.json(result);
    for(let i=0; i<result.length;i++){
        console.log(result[i].Fname+" "+result[i].Lname);
    }
});
app.post("/addspname",async(req,res)=>{
    const fname=req.body.fname;
    const lname=req.body.lname;
    const newspName=spNames();
    newspName.Fname=fname;
    newspName.Lname=lname;
    newspName.id=null;
    await newspName.save();
    res.json(newspName);
});

app.get("/getspname",async(req,res)=>{
    const result= await spNames.find({},'Fname Lname');
    res.json(result);
    for(let i=0; i<result.length;i++){
        console.log(result[i].Fname+" "+result[i].Lname);
    }
});

app.get("/getallsessions",async(req,res)=>{
    const result=await sessions.find({});
    res.json(result);
    for(let i=0;i<result.length;i++){
        console.log(result[i]);
    }
});

app.post("/addsession",async(req,res)=>{
    const newSession=sessions();
    newSession.idd=parseInt(req.body.id);
    newSession.child=req.body.child;
    newSession.specialest=req.body.specialest;
    newSession.session=req.body.session;
    newSession.date=req.body.date;
    newSession.day=req.body.day;

    await newSession.save();
    res.json(newSession);
    console.log(newSession);
});

module.exports = app;