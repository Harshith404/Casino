const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    balance: Number,
    role:{
        type:String,
        default:"user"
    }
});

module.exports = mongoose.model("User", userSchema);