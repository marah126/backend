const mongoose = require("mongoose");
const schema=mongoose.Schema; 
const postsSchema =new schema({
    title:String,
    text:String,
    imageName:String,
    imagePath:String,
    date:String,
    time:String

});
const posts =mongoose.model("post",postsSchema);
module.exports=posts;