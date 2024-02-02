const express = require('express');
const mongoose = require('../connectDB');
const multer = require('multer');
const path = require('path');


const app = express.Router();
const specialest=require("../models/specialestInfo");
const spImage=require("../models/specialestImage");
const spFile=require("../models/fileSpecialest");
const checkSignup=require("../models/checkSignup");
const spname=require("../models/specialestNames");
const spNames = require('../models/specialestNames');
app.get("/getSPInfoByID",async(req,res)=>{
  id=req.query.id;
  const result=await specialest.findOne({idd:id});
  res.json(result);
  console.log("getSPInfoByID");
  console.log(result);
});

app.post("/addSpecialestInfo",async(req,res)=>{
    const newSp = new specialest({
        firstName: req.body.fname,
        secondName:req.body.secname,
        thirdName:req.body.thname,
        lastName:req.body.lname,
        idd: req.body.id,
        startDate: req.body.startDate,
        phone: req.body.phone,
        address: req.body.address,
        specialise: req.body.specialise,
      });

      const savedSp = await newSp.save();
      console.log("sp added "+savedSp);

      const check=new checkSignup({
        id:req.body.id,
        type:"SP"
    });
    const check2= await check.save();
    console.log("added to check signup  "+check2);

    const newspName= new spNames({
      Fname:firstName,
      Lname:lastName,
      id:idd
    });
    const savedName= await newspName.save();
    res.status(200).json(savedSp);
});


///////////////////////////////////////////////////////////////////////////////////////////////// 
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
  });
  
  const upload = multer({ storage: storage });
  
  // Endpoint for uploading images
  app.post('/uploadSP', upload.single('image'), async(req, res) => {// personal image
    try{
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }
    
    // Save the image details to MongoDB
    const spID = req.body.spID;
  
    const newImage = new spImage({
      filename: req.file.originalname,
      path: req.file.path,
      spID:spID,
      type:"personal"
    });
  
    // Save the new Specialest information to the database
    const savedImage = await newImage.save();
    res.status(200).json(savedImage);
    }
    catch(error){
      console.log(error);
    }
    
  });
  
  app.post('/uploadJobimageSP', upload.single('image'), async(req, res) => {
    try{
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }
    
    // Save the image details to MongoDB
    const spID = req.body.spID;
  
    const newImage = new spImage({
      filename: req.file.originalname,
      path: req.file.path,
      spID:spID,
      type:"job"
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
  
  // Endpoint to retrieve an image by ID
  app.get('/getSPImage', async (req, res) => { // get personal
    try {
      const id = req.query.id;
      const image = await spImage.findOne({'spID':id, 'type': 'personal'});
      console.log(image);
      if (!image) {
        return res.status(404).json({ message: 'Image not found' });
      }
      console.log(image.filename);
      res.sendFile(path.join(uploadsDirectory, image.filename));
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

  app.get('/getJobImageSP', async (req, res) => {
    try {
      const id = req.query.id; // Use req.query.id to get the query parameter
      const image = await spImage.findOne({ 'spID': id, 'type': 'job'});
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

  app.get('/getAllSPImages', async (req, res) => {
    try {
      const images = await spImage.find({'type': 'personal'});
  
      if (!images || images.length === 0) {
        return res.status(404).json({ message: 'Images not found' });
      }
  
      // const imageDetails = images.map(image => ({
      //   id: image.childID,
      //   path: image.path.replace(/\\/g, '/'),
      // }));
  
      res.status(200).json(images);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////// Files //////////////////////////////////////////////////////////////////////////////////////////
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
  
  // Endpoint for file storage upload
  app.post('/uploadfileSP', fileStorageUpload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).send('No file uploaded.');
      }
      const spID = req.body.spID;
  
      // Save the file storage details to MongoDB
      const newFileStorage = new spFile({
        filename: req.file.filename,
        path: req.file.path,
        spID:spID
      });
  
      const savedFileStorage = await newFileStorage.save();
  
      res.status(200).json(savedFileStorage);
    } catch (error) {
      console.error('Error uploading file storage:', error);
      res.status(500).send('Internal Server Error');
    }
  });
  
  // Serve uploaded files statically
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
  
  
  // app.get("/getspId",async(req,res)=>{
  //   try{
  //     const fname=req.query.fname;
  //     const lname=req.query.lastName;
  //     const result=await specialest.findOne({firstName:fname,lastName:lname},'idd');
  //     if(result){
  //      res.json(result);
  //     }else{
  //       console.log("nooo");
  //     }
  //   }
  //   catch(error){
  //     console.log(error);
  //   }
  // });


  app.get("/filterSp",async(req,res)=>{
    try{
      const searchBy=req.query.searchBy;
      const value=req.query.value;

      if(searchBy=='sick'){
        const result= await specialest.find({
          specialise:value
        },{ firstName: 1, lastName: 1, idd:1, _id: 0 });

        if(result.length>0){
          res.status(200).json(result);
        }else{
          res.status(404).json({message:"no data"});
        }
      }else if(searchBy=='year'){
        
        const year= parseInt(req.query.value, 10);
        const result= await specialest.find({
          startDate:{
            $gte: new Date(`${year}-01-01T00:00:00.000Z`),
            $lt: new Date(`${year + 1}-01-01T00:00:00.000Z`)
        },
        },{ firstName: 1, lastName: 1, idd:1, _id: 0 });

        if(result.length>0){
          res.status(200).json(result);
        }else{
          res.status(404).json({message:"no data"});
        }
      }

    }catch(error){
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  app.get("/getSpNameee",async(req,res)=>{
    try{
      const id = req.query.id;
      const response=await specialest.findOne({idd:id},{firstName:1,lastName:1,_id: 0 });
      console.log(response);
      res.status(200).json(response);
    }catch(error){

    }
  });

  app.put("/updatePhonesp", async (req, res) => {
    try {
        const id = req.query.id;
        const phone=req.body.phone;
  
        // Update the document with the new email
        const result = await specialest.updateOne({ idd: id }, { $set: { phone:phone } });
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
module.exports = app;