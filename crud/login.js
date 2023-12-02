const express = require('express');
const mongoose = require('../connectDB');
const app = express.Router();
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const login = require("../models/login");
const checkSignup=require("../models/checkSignup");
const signup=require("../models/signup");
const verify=require("../models/verified");

app.post("/login", async (req, res) => {
   // const newlog = new login();
    const email = req.body.email;
    const password = req.body.password;
    if (email == "" || password == "") {
        return res.status(500).json({ massage: "Email or Password is blank!!" });
    }
    else {
        try {
            const user = await login.find({
                $or: [
                    { email: email },
                    { cid: email },
                ],
            }).exec();

            if (user.length > 0) {
                // Users found with the specified email or cid
                console.log('Users found:', user);
                let hashpass=user[0].password;
                if (bcrypt.compareSync(password,hashpass)) {
                    res.status(200).json({ massage: "pass correct" });
                }
                else {
        
                    console.log(password);
                    res.status(500).json({ massage: "wrooong passss" });
                }
            }
            else {
                // No users found with the specified email or cid
                console.log('No users found');
                res.status(500).json({ massage: "No users found with the specified email or cid" });
            }
        } catch (err) {
            console.error(err);
        }
    }

});
///////////////// don't link this , it is for you just////////////////////////////////////
app.post("/add",async(req,res)=>{
    const newlog=login();
    const password=req.body.password;
    const saltRounds=10;
    let hashpass=bcrypt.hashSync(password,saltRounds);
    newlog.email=req.body.email;
    newlog.cid=req.body.cid;
    newlog.password=hashpass;

    await newlog.save();
    res.json(newlog);
    
});

app.post("/signup",async(req,res)=>{
    const newSignup=signup();
    const id=req.body.id;
    const password=req.body.password;
    const saltRounds=10;
    let hashpass=bcrypt.hashSync(password,saltRounds);
    const r=await checkSignup.find({id:id}).exec();
    if(r.length>0){
       // res.json(r);
        newSignup.id=req.body.id;
        newSignup.email=req.body.email;
        newSignup.password=hashpass;
        newSignup.verified=false;

        newSignup.save();
        console.log("Done");
        res.status(200).json({ massage: "Done" });
        
    }else{
        console.log("eeee");
        res.status(500).json({ massage: " something is wrong" });
    }
});

// app.get("/email",(req,res)=>{
//     const transporter = nodemailer.createTransport({
//         host: 'smtp.gmail.com',
//   port: 465,
//   secure: true,
//         auth: {
//           user: 'sanad.org0@gmail.com',
//           pass: '1234567890sanad',
//         },
//       });

//       const mailOptions = {
//         from: 'sanad.org0@gmail.com',
//         to: 'direenimarah@gmail.com',
//         subject: 'Subject of the Email',
//         text: 'This is the email content.',
//       };
      
//       transporter.sendMail(mailOptions, (error, info) => {
//         if (error) {
//           console.log('Error sending email:', error);
//         } else {
//           console.log('Email sent:', info.response);
//         }
//       });
      
      
// });

module.exports = app;
