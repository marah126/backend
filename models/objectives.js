const mongoose = require("mongoose");
const schema=mongoose.Schema; 
const objictivesSchema =new schema({
    childId:String,
    spId:String,
    type:String,
    subType:String,
    object:String,
    percent:String,
    status:String,
    // month:String,
    // year:String,
    // evalMonth:String,
    // evalYear:String

});
const objective =mongoose.model("objective",objictivesSchema);
module.exports=objective;