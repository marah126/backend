
const mongoose = require("mongoose");
const fileSPSchema = new mongoose.Schema({
    filename: String,
    path: String,
    spID:String,
  });
  
  // Create the image model
  const file = mongoose.model('fileSpecialest', fileSPSchema);
  
module.exports=file;