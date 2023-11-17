const mongoose = require("mongoose");
const schema=mongoose.Schema; 
const spNamesSchema =new schema({
    Fname:String,
    Lname:String,
    id:Object,
    

});
const spNames =mongoose.model("specialestNames",spNamesSchema);
module.exports=spNames;