const mongoose = require("mongoose");
const schema=mongoose.Schema; 
const signupSchema =new schema({
    email:String,
    id:String,
    password:String,
    verified:Boolean,
    type:String

});
const signup =mongoose.model("signup",signupSchema);
module.exports=signup;