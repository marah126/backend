const mongoose = require("mongoose");
const schema=mongoose.Schema; 
const checkSignupSchema =new schema({
    id:String,
    type:String

});
const checkSignup =mongoose.model("checkSignup",checkSignupSchema);
module.exports=checkSignup;