const express = require("express");

const app = express();
app.use(express.json());
const PORT = 3500;

const users = {
  harshith: {
    balance:1000
  }
}

app.get("/user/:username",(req,res)=>{
  const username = req.params.username;
  if (!users[username])
  {
    return res.json({
      "error":"User not found"
    })
  }
  res.json({
    balance:users[username].balance
  });
});

app.get("/",(req,res)=>{
  res.send("Casino Backend Running");
});

app.post("/coinflip",(req,res)=>{
  const username = req.body.username;
  if (!users[username]) {
  return res.json({
    error: "User not found"
  });
}
  const bet = req.body.bet;
  if(typeof(bet)!=="number")
  { 
    return res.json({
       "error" : "Bet must be a number"
      })
    }
  
  if(bet<=0)
  {
    return  res.json({
      "error":"Bet must be greater than 0"
    })
  }
  const guess = req.body.guess;
  if(guess!=="Heads" && guess!=="Tails")
  {
    return res.json({
      "error":"Guess must be Heads or Tails "
    })
  }
  const coin = Math.random();
  let face;
  if (coin>0.5){
    face="Heads";
  }
  else{
    face="Tails";
  }
  if(guess===face){
    users[username].balance+=bet;
    res.json({
      "won":true,
      "coin":face,
      "profit":bet,
      "balance":users[username].balance
    })
  }
    else{
      users[username].balance-=bet;
      res.json({
        "won":false,
        "coin":face,
        "profit":-bet,
        "balance":users[username].balance
      })
    }
})

app.post("/register", (req,res)=>{
  const username = req.body.username;
  if (users[username])
  {
    return res.json({
      "error":"User already exists"
    })
  }
  users[username]= {
    balance:1000
  }
  res.json({
    "message":"User created"
  })
  
})

app.listen(PORT,()=>{
  console.log( `Server running on ${PORT}`)
});