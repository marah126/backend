const express = require('express');
const mongoose = require('../connectDB');
const multer = require('multer');
const path = require('path');


const app = express.Router();


const child = require("../models/childInfo");
const chNames = require("../models/childrenNames");
const ImageChild=require("../models/imageChild");

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
    childID:childID
  });

  // Save the new child information to the database
  const savedImage = await newImage.save();
  res.status(201).json(savedImage);
  }
  catch(error){
    console.log(error);
  }
  
});

const uploadsDirectory = path.join(__dirname, '..', 'uploads');

app.use('/images', express.static(uploadsDirectory));

// Endpoint to retrieve an image by ID
app.get('/getImage/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const image = await ImageChild.findOne({'childID':id});
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