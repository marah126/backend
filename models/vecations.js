const mongoose = require("mongoose");
const schema=mongoose.Schema; 
const vecationSchema =new schema({
    id:String,
    reason:String,
    type:String,
    status:String,
    startDate:Date,
    endDate:Date,

});
const vecations =mongoose.model("vecation",vecationSchema);
module.exports=vecations;