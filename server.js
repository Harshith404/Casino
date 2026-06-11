const connectDB = require("./config/db");
require("dotenv").config();
connectDB();
const express = require("express");
const app = express();
app.use(express.json());
const PORT = 3500;

const { loginUser , registerUser, getUser, coinFlip,deposit, withdraw, leaderboard } = require("./controllers/userController");
const userRoutes = require("./routes/userRoutes");
app.use("/", userRoutes);

app.listen(PORT,()=>{
  console.log( `Server running on ${PORT}`)
});