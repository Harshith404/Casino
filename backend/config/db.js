const mongoose = require("mongoose");
function connectDB(){
    const MONGO_URI =process.env.MONGO_URI;
    mongoose.connect(MONGO_URI)
    .then(() => {
        console.log("MongoDB Connected");
    })
    .catch((err) => {
        console.log(err);
    });
}
module.exports = connectDB;