const mongoose = require("mongoose");
const fileChildSchema = new mongoose.Schema({
    filename: String,
    path: String,
    childID:String,
  });
  
  // Create the image model
  const file = mongoose.model('fileChild', fileChildSchema);
  
module.exports=file;