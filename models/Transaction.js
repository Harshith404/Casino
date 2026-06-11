const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  username:String,
  type:String,
  amount:Number,
  balanceAfter:Number,
  createdAt:{
    type:Date,
    default:Date.now
  }
});

module.exports = mongoose.model(
  "Transaction", transactionSchema
);