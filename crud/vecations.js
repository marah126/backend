const express = require('express');
const mongoose = require('../connectDB');
const app = express.Router();

const vecation=require("../models/vecations");
const specialest=require("../models/specialestInfo");
const vecations = require('../models/vecations');
const { removeAllListeners } = require('../models/childrenNames');

app.post("/newVecation",async(req,res)=>{
    try{
        const newVecation=new vecation({
            id:req.body.id,
            reason:req.body.reason,
            type:req.body.type,
            status:"pending",
            startDate:req.body.startDate,
            endDate:req.body.endDate,
        });

        const savedVecation= await newVecation.save();
        res.status(200).json(savedVecation);
        console.log(savedVecation);
    }
    catch(error){
        console.log("error "+error);
    }
});


app.get("/getVecations", async (req, res) => {
    try {
        const employeeId = req.query.id;
        const year = parseInt(req.query.year, 10); 
        console.log(year);
        


        const vecations = await vecation.find({
            id: employeeId,
            status:'accepted',
            startDate:{
                $gte: new Date(`${year}-01-01T00:00:00.000Z`),
                $lt: new Date(`${year + 1}-01-01T00:00:00.000Z`)
              },
        });
        console.log(vecations);
        if(vecations.length > 0 ){
            res.status(200).json(vecations);
        }
        else{
            res.status(404).json({message: "No vacations ." });
        }

    } catch (error) {
        console.error("Error: ", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.get("/enteredYear",async(req,res)=>{

    try{
        const id=req.query.id;
        const startYearRes=await specialest.findOne({'idd':id},'startDate');
        const startYear = startYearRes.startDate.getFullYear();
        res.status(200).json(startYear);
        console.log(startYear);
    }
    catch(error){
        res.status(500).json({ error: "Internal Server Error" });
        console.log(error);
    }
});


app.get("/detailes",async(req,res)=>{
    try{
        const id=req.query.id;
        const year = parseInt(req.query.year, 10); 

        const startYearRes=await specialest.findOne({'idd':id},'startDate');
        const startYear = startYearRes.startDate.getFullYear();

        const date = new Date();
        const currentYear=date.getFullYear();
        console.log(startYear);

        let sickDays=0;
        let yearlyDays=0;
        let previousDays=0;
        let previousDays2=0;
        let shifted=0;
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


        const sickVecations = await vecations.aggregate([
            {
              $match: {
                id,
                type: 'مرضية',
                status:'accepted',
                startDate: {
                  $gte: new Date(`${year}-01-01T00:00:00.000Z`),
                  $lt: new Date(`${year + 1}-01-01T00:00:00.000Z`),
                },
              },
            },
            {
              $group: {
                _id: null,
                totalVacationDays: {
                  $sum: {
                    $add: [
                      1, // Add 1 to include the end date
                      {
                        $ceil: {
                          $divide: [
                            {
                              $subtract: [
                                { $toDate: "$endDate" },
                                { $toDate: "$startDate" },
                              ],
                            },
                            1000 * 60 * 60 * 24, // Convert milliseconds to days
                          ],
                        },
                      },
                    ],
                  },
                },
              },
            },
          ]);
          if (sickVecations && sickVecations.length > 0 && sickVecations[0].totalVacationDays !== undefined) {
            console.log("sick "+sickVecations[0].totalVacationDays);
            sickDays=sickVecations[0].totalVacationDays;
            
          } else {
            sickDays=0;
            console.error("Unexpected ", sickDays);
          }
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        const yearlyVecations = await vecations.aggregate([
            {
              $match: {
                id,
                type: 'سنوية',
                status:'accepted',
                startDate: {
                  $gte: new Date(`${year}-01-01T00:00:00.000Z`),
                  $lt: new Date(`${year + 1}-01-01T00:00:00.000Z`),
                },
              },
            },
            {
              $group: {
                _id: null,
                totalVacationDays: {
                  $sum: {
                    $add: [
                      1, // Add 1 to include the end date
                      {
                        $ceil: {
                          $divide: [
                            {
                              $subtract: [
                                { $toDate: "$endDate" },
                                { $toDate: "$startDate" },
                              ],
                            },
                            1000 * 60 * 60 * 24, // Convert milliseconds to days
                          ],
                        },
                      },
                    ],
                  },
                },
              },
            },
          ]);
          if (yearlyVecations && yearlyVecations.length > 0 && yearlyVecations[0].totalVacationDays !== undefined) {
            console.log("year "+yearlyVecations[0].totalVacationDays);
            yearlyDays=+yearlyVecations[0].totalVacationDays;
          } else {
            yearlyDays=0;
            console.error("Unexpected ", yearlyDays);
          }
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        const previous = await vecations.aggregate([
            {
              $match: {
                id,
                type: 'سنوية',
                status:'accepted',
                startDate: {
                  $gte: new Date(`${year-1}-01-01T00:00:00.000Z`),
                  $lt: new Date(`${year}-01-01T00:00:00.000Z`),
                },
              },
            },
            {
              $group: {
                _id: null,
                totalVacationDays: {
                  $sum: {
                    $add: [
                      1, // Add 1 to include the end date
                      {
                        $ceil: {
                          $divide: [
                            {
                              $subtract: [
                                { $toDate: "$endDate" },
                                { $toDate: "$startDate" },
                              ],
                            },
                            1000 * 60 * 60 * 24, // Convert milliseconds to days
                          ],
                        },
                      },
                    ],
                  },
                },
              },
            },
          ]);
          if (previous && previous.length > 0 && previous[0].totalVacationDays !== undefined) {
            console.log("previous "+previous[0].totalVacationDays);
            previousDays=previous[0].totalVacationDays;
            
          } else {
            previousDays=0;
            console.error("Unexpected ", previousDays);
          }
 ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////         
        const previous2 = await vecations.aggregate([
            {
              $match: {
                id,
                type: 'سنوية',
                status:'accepted',
                startDate: {
                  $gte: new Date(`${year - 2}-01-01T00:00:00.000Z`),
                  $lt: new Date(`${year - 1}-01-01T00:00:00.000Z`),
                },
              },
            },
            {
              $group: {
                _id: null,
                totalVacationDays: {
                  $sum: {
                    $add: [
                      1, // Add 1 to include the end date
                      {
                        $ceil: {
                          $divide: [
                            {
                              $subtract: [
                                { $toDate: "$endDate" },
                                { $toDate: "$startDate" },
                              ],
                            },
                            1000 * 60 * 60 * 24, // Convert milliseconds to days
                          ],
                        },
                      },
                    ],
                  },
                },
              },
            },
          ]);
          if (previous2 && previous2.length > 0 && previous2[0].totalVacationDays !== undefined) {
            console.log("previous2 "+previous2[0].totalVacationDays);
            previousDays2=previous2[0].totalVacationDays
            
          } else {
            previousDays2=0;
            console.error("Unexpected ", previousDays2);
          }
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        const leftedSick=14-sickDays;
        let leftedYearly;
        console.log("ggggggg"+year);
        if(year - 2 - startYear>=0){
            if(year -2-startYear > 5){
                console.log("1");
                shifted=21-previousDays2;
                shifted=shifted+(21-previousDays);
            }
            else{
                console.log("2");
                shifted=14-previousDays2;
                if(year-1-startYear>5){
                    console.log("3");
                    shifted=shifted+(21-previous);
                }else{
                    console.log("4");
                    shifted=shifted+(14-previous);
                }
            }
        }else{
            if((year-1-startYear>=0 )&&(year-1-startYear >5 )){
                console.log("5");
                shifted=21-previousDays;
            }
            else if(year-1-startYear>=0){
                console.log("6");
                shifted=14-previousDays;
            }
        }
    
        if((year - startYear)>5){
            leftedYearly = 21-yearlyDays;
        }
        else{
            leftedYearly=14-yearlyDays;
        }
        let allLefted=shifted+leftedYearly;
        console.log("all "+allLefted);
        console.log("shifted "+shifted);
        console.log("lefted sick "+leftedSick);
        console.log("lefted yearly "+leftedYearly);
        res.status(200).json({
            message:"Done",
            sickNo:sickDays,
            yearlyNo:yearlyDays,
            sickRemaining:leftedSick,
            yearlyRemaining:leftedYearly,
            all:allLefted,
            shifted:shifted
        });
    }
    catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
        console.log(error);
    }
});
    
app.get("/test",async(req,res)=>{
    try {
        
        const id=req.query.id;
        const year = parseInt(req.query.year, 10); 
        const result = await vecations.aggregate([
          {
            $match: {
              id,
              type: 'سنوية',
              startDate: {
                $gte: new Date(`${year}-01-01T00:00:00.000Z`),
                $lt: new Date(`${year + 1}-01-01T00:00:00.000Z`),
              },
            },
          },
          {
            $group: {
              _id: null,
              totalVacationDays: {
                $sum: {
                  $add: [
                    1, // Add 1 to include the end date
                    {
                      $ceil: {
                        $divide: [
                          {
                            $subtract: [
                              { $toDate: "$endDate" },
                              { $toDate: "$startDate" },
                            ],
                          },
                          1000 * 60 * 60 * 24, // Convert milliseconds to days
                        ],
                      },
                    },
                  ],
                },
              },
            },
          },
        ]);
    
        if (result && result.length > 0 && result[0].totalVacationDays !== undefined) {
          const totalVacationDays = result[0].totalVacationDays;
    
          res.json({ totalVacationDays });
        } else {
          console.error("Unexpected result structure:", result);
          res.status(500).json({ message: "Unexpected result structure" });
        }

/////////////////////////////////////////////////////////////////////////////////////////////////

        const sickVecations = await vecations.countDocuments({
            id: id,
            type: 'مرضية',
            startDate: {
                $gte: new Date(`${year}-01-01T00:00:00.000Z`),
                $lt: new Date(`${year + 1}-01-01T00:00:00.000Z`)
            },
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
      }
});


module.exports = app;