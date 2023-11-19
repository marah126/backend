const mongoose = require("mongoose");
const imageChildSchema = new mongoose.Schema({
    filename: String,
    path: String,
    childID:String,
  });
  
  // Create the image model
  const image = mongoose.model('ImageChild', imageChildSchema);
  
module.exports=image;