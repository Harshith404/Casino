const express = require("express");

const app = express();

const PORT = 3500;

app.get("/",(req,res)=>{
  res.send("Casino Backend Running");
});

app.get("/user",(req,res)=>{
  res.json({
      username:"harshith",
      balance:1000
  })
})

app.listen(PORT,()=>{
  console.log( `Server running on ${PORT}`)
});