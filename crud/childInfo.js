const express = require('express');
const mongoose = require('../connectDB');
const app = express.Router();


const child = require("../models/childInfo");
const chNames = require("../models/childrenNames");

app.post("/addChildInfo",async(req,res)=>{
    try {

      const parseDate = (dateString) => {
        const [day, month, year] = dateString.split('-');
        return new Date(`${year}-${month}-${day}`);
      };
  
      // Format session data
      const formatSessionData = (sessions) => {
        return sessions.map(session => ({
          sessionName: session.sessionName,
          no: session.sessionNo,
        }));
      };
        // Create a new child instance with the provided data
        const newChild = new child({
          firstName: req.body.fname,
          secondName:req.body.secname,
          thirdName:req.body.thname,
          lastName:req.body.lname,
          idd: req.body.id,
          birthDate: req.body.birthDate,
          enteryDate: req.body.enteryDate,
          firstSessionDate: req.body.firstSessionDate,
          fatherPhone: req.body.fatherPhone,
          motherPhone: req.body.motherPhone,
          address: req.body.address,
          diagnosis: req.body.diagnosis,
          sessions:formatSessionData(req.body.sessions),
        });
    
        // Save the new child information to the database
        const savedChild = await newChild.save();
        res.status(200).json(savedChild);

        // --------- add the fname and lname to the children name collection-------------//
        const fname=req.body.fname;
        const lname=req.body.lname;
        const newChName=chNames();
        newChName.Fname=fname;
        newChName.Lname=lname;
        newChName.id=req.body.id;
        await newChName.save();
        console.log(newChName);
    
        
      } catch (error) {
        console.error('Error adding child information:', error);

        //res.status(500).json({ error: 'Internal Server Error' });
      }
});

app.get("/getChildInfoByID",async(req,res)=>{
  id=req.query.id;
  const result=await child.findOne({idd:id});
  res.json(result);
  console.log("getChildInfoByID");
  console.log(result);
});

app.delete("/delete",async(req,res)=>{
  id=req.body.id;
  const resp= await child.deleteMany({idd:id});
  res.json(resp);
})


module.exports = app;