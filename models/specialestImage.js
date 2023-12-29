const mongoose = require("mongoose");
const imageSPSchema = new mongoose.Schema({
    filename: String,
    path: String,
    spID:String,
    type:String,
  });
  
  // Create the image model
  const image = mongoose.model('ImageSpecialest', imageSPSchema);
  
module.exports=image;