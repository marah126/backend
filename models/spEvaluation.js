const mongoose = require("mongoose");
const schema=mongoose.Schema; 
const spEvalSchema =new schema({
    spname:String,
    spId:String,
    cid:String,
    eval:String,
    category:String,
    month:String,
    year:String

});
const spEval =mongoose.model("spEvaluation",spEvalSchema);
module.exports=spEval;