const cors = require("cors");
const connectDB = require("./config/db");
require("dotenv").config();
connectDB();
const express = require("express");
const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 3500;

const { loginUser , registerUser, getUser, coinFlip,deposit, withdraw, leaderboard } = require("./controllers/userController");
const userRoutes = require("./routes/userRoutes");
app.use("/", userRoutes);

app.get("/", (req,res)=>{
    res.send("Casino Backend Running");
});

app.listen(PORT,()=>{
  console.log( `Server running on ${PORT}`)
});