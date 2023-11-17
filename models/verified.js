const mongoose = require("mongoose");
const schema=mongoose.Schema; 
const verifySchema =new schema({
    id:String,
    uniqueString:String,
    created:Date,
    expired:Date,

});
const verify =mongoose.model("verify",verifySchema);
module.exports=verify;