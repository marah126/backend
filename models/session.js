const mongoose = require("mongoose");
const schema=mongoose.Schema; 
const sessionSchema =new schema({
    idd:Number,
    child:String,
    specialest:String,
    session:String,
    date:Date,
    endMonth:Date,
    day:String

});
const sessions =mongoose.model("session",sessionSchema);
module.exports=sessions;