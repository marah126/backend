const mongoose = require("mongoose");
const schema=mongoose.Schema; 
const notesSchema =new schema({
    idd:Number,
    specialest:String,
    session:String,
    date:Date,
    personalNotes:String,
    spNotes:String,
    parentsNotes:String,

});
const notes =mongoose.model("notes",notesSchema);
module.exports=notes;