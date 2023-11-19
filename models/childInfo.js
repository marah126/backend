const mongoose = require("mongoose");
const schema=mongoose.Schema; 
const childInfSchema =new schema({
    firstName:String,
    secondName:String,
    thirdName:String,
    lastName:String,
    idd:String,
    birthDate:Date,
    enteryDate:Date,
    firstSessionDate:Date,
    fatherPhone:String,
    motherPhone:String,
    address:String,
    diagnosis:String,
    sessions:[
        {
            sessionName:String,
            no:Number
        }
    ],
    


});
const childInfo =mongoose.model("childInfo",childInfSchema);
module.exports=childInfo;