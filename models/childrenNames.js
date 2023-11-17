const mongoose = require("mongoose");
const schema=mongoose.Schema; 
const chNamesSchema =new schema({
    Fname:String,
    Lname:String,
    id:Object,
    

});
const chNames =mongoose.model("childrenNames",chNamesSchema);
module.exports=chNames;