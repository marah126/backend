const express = require('express');
const mongoose = require('../connectDB');
const app = express.Router();

const object = require("../models/objectives");

app.post("/newObject",async(req,res)=>{
    try{
        const childID=req.body.childID;
        const spID=req.body.spID;
        const type=req.body.type;
        const subType=req.body.subType;
        const objectt=req.body.object;
        const percent=req.body.percent;
        
        const newObject= new object({
            childId:childID,
            spId:spID,
            type:type,
            subType:subType,
            object:objectt,
            percent:percent,
            status:"processing"
        });

        const savedObj= await newObject.save();
        res.status(200).json(savedObj);
    }catch(error){
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

app.post("/updateObj",async(req,res)=>{
    try{
        const childID=req.body.childID;
        const spID=req.body.spID;
        const type=req.body.type;
        const subType=req.body.subType;
        const objectt=req.body.object;
        const percent=req.body.percent;
        const newOb=req.body.newOb;
        const newPercent=req.body.newPercent;

        const updateObj= await object.updateOne({
            childId:childID,
            spId:spID,
            type:type,
            subType:subType,
            object:objectt,
            percent:percent,
            status:"processing"},
            {$set:{ object:newOb, percent:newPercent }});

            if(updateObj.matchedCount>0){
                res.status(200).json(updateObj);
            }
            else{
                res.status(404).json({ message: 'Document not found or no modifications made' });
            }

    }catch(error){
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

app.post("/updateObjStatus",async(req,res)=>{
    try{
        const childID=req.body.childID;
        const spID=req.body.spID;
        const type=req.body.type;
        const subType=req.body.subType;
        const objectt=req.body.object;
        const percent=req.body.percent;

        const updateObj= await object.updateOne({
            childId:childID,
            spId:spID,
            type:type,
            subType:subType,
            object:objectt,
            percent:percent,
            status:"processing"},
            {$set:{ status:"done"}});

            if(updateObj.matchedCount>0){
                res.status(200).json(updateObj);
            }
            else{
                res.status(404).json({ message: 'Document not found or no modifications made' });
            }

    }catch(error){
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

app.get("/getObjects",async(req,res)=>{
    try{
        const childID=req.query.childID;
        const spID=req.query.spID;
        const type=req.query.type;
        const subType=req.query.subType;

        const objects= await object.find({ childId:childID , spId:spID , type:type , subType:subType ,status:"processing"});
        if(objects.length >0){
            res.status(200).json(objects);
        }else{
            res.status(404).json({message:"no data"});
        }

    }catch(error){
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

app.get("/getDoneObj",async(req,res)=>{
    try{
        const childID=req.query.childID;
        const spID=req.query.spID;
        const type=req.query.type;
        const subType=req.query.subType;

        const objects= await object.find({ childId:childID , spId:spID , type:type , subType:subType ,status:"done"});
        if(objects.length >0){
            res.status(200).json(objects);
        }else{
            res.status(404).json({message:"no data"});
        }

    }catch(error){
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
})

module.exports = app;