const mongoose = require("mongoose");
const schema=mongoose.Schema; 
const loginSchema =new schema({
    email:String,
    cid:String,
    password:String

});
const login =mongoose.model("login",loginSchema);
module.exports=login;