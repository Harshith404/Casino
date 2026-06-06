const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: String,
    balance: Number
});

module.exports = mongoose.model("User", userSchema);