const express = require('express');
const mongoose = require('../connectDB');
const app = express.Router();
const multer = require('multer');
const path = require('path');
const post=require("../models/posts");


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
  });
  
  const upload = multer({ storage: storage });
  
app.post("/newPost",upload.single('image'),async(req,res)=>{
    try{
        const title=req.body.title;
        const text=req.body.text;
        const date=req.body.date;
        const time=req.body.time;
        const filename= req.file.originalname;
        const path= req.file.path;

        const newPost=new post({
            'title':title,
            'text':text,
            'date':date,
            'time':time,
            'imageName':filename,
            'imagePath':path
        });
        const savedPost= await newPost.save();
        res.status(200).json(savedPost);

    }catch(error){
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

const uploadsDirectory = path.join(__dirname, '..', 'uploads');
app.use('/images', express.static(uploadsDirectory));

app.get("/getPosts",async(req,res)=>{
    try{
        const allPosts=await post.find({});
        if(allPosts.length>0){
            res.status(200).json(allPosts);
        }
        else{
            res.status(404).json({message:"no posts found"});
        }
        
    }catch(error){
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

app.get('/getImagePost', async (req, res) => {
    try {
      const filename = req.query.filename; // Use req.query.id to get the query parameter
      
      //console.log(image.filename);
      res.sendFile(path.join(uploadsDirectory, filename));
      console.log(path.join(uploadsDirectory, filename));
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

module.exports = app;