const mongoose = require("mongoose");
//mongodb+srv://sanad:sanad123456@cluster0.eip3xhr.mongodb.net/?retryWrites=true&w=majority
mongoose
	.connect(
        "mongodb+srv://sanad:sanad123456@cluster0.eip3xhr.mongodb.net/?retryWrites=true&w=majority")
	.then(() => {
		console.log("connected successfully");
	})
	.catch((error) => {
		console.log("error with connecting with the DB ", error);
	});

module.exports=mongoose;