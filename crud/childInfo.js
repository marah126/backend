const express = require('express');
const mongoose = require('../connectDB');
const multer = require('multer');
const path = require('path');

const app = express.Router();

const child = require("../models/childInfo");
const chNames = require("../models/childrenNames");
const ImageChild=require("../models/imageChild");
const fileChild=require("../models/fileChild");
const checkSignup=require("../models/checkSignup");
const childInfo = require('../models/childInfo');
const specialestInfo = require('../models/specialestInfo');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

app.post('/upload', upload.single('image'), async(req, res) => {
  try{
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  
  // Save the image details to MongoDB
  const childID = req.body.childID;

  const newImage = new ImageChild({
    filename: req.file.originalname,
    path: req.file.path,
    childID:childID,
    type:"personal"
  });

  // Save the new child information to the database
  const savedImage = await newImage.save();
  res.status(200).json(savedImage);
  }
  catch(error){
    console.log(error);
  }
  
});

app.post('/uploadIDimageChild', upload.single('image'), async(req, res) => {
  try{
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  
  // Save the image details to MongoDB
  const childID = req.body.childID;

  const newImage = new ImageChild({
    filename: req.file.originalname,
    path: req.file.path,
    childID:childID,
    type:"identity"
  });

  // Save the new child information to the database
  const savedImage = await newImage.save();
  res.status(200).json(savedImage);
  }
  catch(error){
    console.log(error);
  }
  
});


const uploadsDirectory = path.join(__dirname, '..', 'uploads');

app.use('/images', express.static(uploadsDirectory));

app.get('/getImage', async (req, res) => {
  try {
    const id = req.query.id; // Use req.query.id to get the query parameter
    const image = await ImageChild.findOne({ 'childID': id, 'type': 'personal'});
    console.log(image);
    
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }

    console.log(image.filename);
    res.sendFile(path.join(uploadsDirectory, image.filename));
    console.log(path.join(uploadsDirectory, image.filename));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.get('/getIDImageChild', async (req, res) => {
  try {
    const id = req.query.id; // Use req.query.id to get the query parameter
    const image = await ImageChild.findOne({ 'childID': id, 'type': 'identity'});
    console.log(image);
    
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }

    console.log(image.filename);
    res.sendFile(path.join(uploadsDirectory, image.filename));
    console.log(path.join(uploadsDirectory, image.filename));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


app.delete("/deleteImages",async(req,res)=>{
  try {
    // Use the signup model to delete all documents
    const result = await ImageChild.deleteMany({});
    
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


app.get('/getAllImages', async (req, res) => {
  try {
    const images = await ImageChild.find({'type': 'personal'});

    if (!images || images.length === 0) {
      return res.status(404).json({ message: 'Images not found' });
    }

    const imageDetails = images.map(image => ({
      id: image.childID,
      path: image.path.replace(/\\/g, '/'),
    }));

    res.status(200).json(images);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'file-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const fileStorageUpload = multer({
  storage: fileStorage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF files are allowed.'));
    }
  },
});

app.post('/uploadfile', fileStorageUpload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }
    const childID = req.body.childID;

    const newFileStorage = new fileChild({
      filename: req.file.filename,
      path: req.file.path,
      childID:childID
    });

    const savedFileStorage = await newFileStorage.save();

    res.status(200).json(savedFileStorage);
  } catch (error) {
    console.error('Error uploading file storage:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
app.post("/addChildInfo",async(req,res)=>{
    try {

      const parseDate = (dateString) => {
        const [day, month, year] = dateString.split('-');
        return new Date(`${year}-${month}-${day}`);
      };
  
      // Format session data
      const formatSessionData = (sessions) => {
        return sessions.map(session => ({
          //specialest:session.specialest,
          sessionName: session.sessionName,
          no: session.sessionNo,
          
        }));
      };
        // Create a new child instance with the provided data
        //console .log(req.body.sessions);
        //const sessions = Array.isArray(req.body.sessions) ? req.body.sessions : [];
        //console.log(req.body);
        //Array(req.body.sessions);
        const sessions = JSON.parse(req.body.sessions); //comment this when using postman

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
          sessions:formatSessionData((sessions)), // use this when using postman  req.body.sessions
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
        console.log("new child is added  "+newChName);

        // ----------------add child to check Signup---------------------------//
        const check=new checkSignup({
          id:req.body.id,
          type:"child"
      });
      const check2= await check.save();
      console.log("added to check signup  "+check2);
    
        
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

app.get("/getchildId",async(req,res)=>{
  try{
    const fname=req.query.fname;
    const lname=req.query.lastName;
    const result=await child.findOne({firstName:fname,lastName:lname},'idd');
    if(result){
     res.json(result);
    }else{
      console.log("nooo");
    }
  }
  catch(error){
    console.log(error);
  }
});

app.delete("/deletechild",async(req,res)=>{
  id=req.body.id;
  const resp= await child.deleteMany({idd:id});
  res.json(resp);
})

app.get("/filterChildren",async(req,res)=>{
  console.log("filter")
  try{
    const searchBy=req.query.searchBy;
    const value=req.query.value;

    if(searchBy=='enteredYear'){
      const year= parseInt(req.query.value, 10);
      console.log(year);
      const result= await child.find({
        enteryDate:{
          $gte: new Date(`${year}-01-01T00:00:00.000Z`),
          $lt: new Date(`${year + 1}-01-01T00:00:00.000Z`)
      },
      },{ firstName: 1, lastName: 1, idd:1, _id: 0 });
      if(result.length>0){
        res.status(200).json(result);
      }
      else{
        res.status(404).json({message:"no data"});
      }

    }else if(searchBy=='birthYear'){
      const year= parseInt(req.query.value, 10);
      console.log(year);
      const result= await child.find({
        birthDate:{
          $gte: new Date(`${year}-01-01T00:00:00.000Z`),
          $lt: new Date(`${year + 1}-01-01T00:00:00.000Z`)
      },
    }, { firstName: 1, lastName: 1, idd:1, _id: 0 });

      if(result.length>0){
        res.status(200).json(result);
      }
      else{
        res.status(404).json({message:"no data"});
      }
    }else if(searchBy=='sick'){
      console.log("sick");
      console.log(value);
      const result= await child.find({
        diagnosis:value
      },
      // { firstName: 1, lastName: 1, idd:1, _id: 0 }
      );

      if(result.length>0){
        res.status(200).json(result);
      }
      else{
        res.status(404).json({message:"no data"});
      }

    }else if(searchBy=='session'){
      const result= await child.find({
        "sessions.sessionName":value
      },{ firstName: 1, lastName: 1, idd:1, _id: 0 });
      if(result.length>0){
        res.status(200).json(result);
      }
      else{
        res.status(404).json({message:"no data"});
      }
    }
  }catch(error){
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
app.put("/updatePhone", async (req, res) => {
  try {
      const id = req.query.id;
      const fatherPhone = req.body.fatherPhone;
      const motherPhone=req.body.motherPhone;

      // Update the document with the new email
      const result = await child.updateOne({ idd: id }, { $set: { fatherPhone: fatherPhone,motherPhone:motherPhone } });
      console.log(result);
      if (result.modifiedCount > 0) {
          res.status(200).json({ message: "phone updated successfully" });
      } else {
          res.status(404).json({ message: "Document not found or email is the same" });
      }
      
  } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
      console.log(error);
  }
});

app.put("/updateEmailchild", async (req, res) => {
  try {
      const id = req.body.id;
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

app.get("/getSpecialists",async(req,res)=>{
  try{
    const cid=req.query.cid;
    const result=await child.findOne({idd:cid});
    const specialests = result.sessions.map(session => session.specialest);
    const specialestsSplit = specialests.flatMap(specialest => specialest.split(' '));

    // Split first names and last names
    const firstNames = specialestsSplit.filter((_, index) => index % 2 === 0);
    const lastNames = specialestsSplit.filter((_, index) => index % 2 !== 0);

    // Find specialests' ids based on first names and last names
    const specialestsData = await specialestInfo.find({
      firstName: { $in: firstNames },
      lastName: { $in: lastNames }
    }).select('firstName lastName idd');

    console.log(specialests);
    // console.log(specialestIds);
   
    

    res.status(200).json(specialestsData);
    
  }catch(error){
    res.status(500).json({ error: 'Internal Server Error' });
    console.log(error);
  }
});
module.exports = app;