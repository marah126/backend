const express = require('express');
const mongoose = require('../connectDB');
const multer = require('multer');
const path = require('path');


const app = express.Router();
const specialest=require("../models/specialestInfo");
const spImage=require("../models/specialestImage");
const spFile=require("../models/fileSpecialest");

app.get("/getSPInfoByID",async(req,res)=>{
  id=req.query.id;
  const result=await specialest.findOne({idd:id});
  res.json(result);
  console.log("getChildInfoByID");
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
  app.post('/uploadSP', upload.single('image'), async(req, res) => {
    try{
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }
    
    // Save the image details to MongoDB
    const spID = req.body.spID;
  
    const newImage = new spImage({
      filename: req.file.originalname,
      path: req.file.path,
      spID:spID
    });
  
    // Save the new Specialest information to the database
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
  app.get('/getSPImage/:id', async (req, res) => {
    try {
      const id = req.params.id;
      const image = await spImage.findOne({'spID':id});
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
  
  

module.exports = app;