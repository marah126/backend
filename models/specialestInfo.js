const mongoose = require("mongoose");
const schema=mongoose.Schema; 
const specialestInfSchema =new schema({
    firstName:String,
    secondName:String,
    thirdName:String,
    lastName:String,
    idd:String,
    startDate:Date,
    phone:String,
    address:String,
    specialise:String,
    
});
const specialestInfo =mongoose.model("specialestInfo",specialestInfSchema);
module.exports=specialestInfo;