const express = require("express");
const fs = require("fs");
const app = express();
app.use(express.json());
const PORT = 3500;

const users = JSON.parse(
  fs.readFileSync("users.json","utf8")
);

function saveUsers() {
  fs.writeFileSync(
    "users.json",
    JSON.stringify(users, null, 2)
  );
}

function userExists(username) {
  return !!users[username];
}

app.get("/user/:username",(req,res)=>{
  const username = req.params.username;
  if(!userExists(username))
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
  if(!userExists(username)) {
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
    saveUsers();
    res.json({
      "won":true,
      "coin":face,
      "profit":bet,
      "balance":users[username].balance
    })
  }
    else{
      users[username].balance-=bet;
      saveUsers();
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
  saveUsers();
  res.json({
    "message":"User created"
  })
  
})

app.post("/deposit",(req,res)=>{
  const username = req.body.username;
  if(!userExists(username))
  {
    return res.json(
      {
        "error" : "User not found"
      }
    )
  }

  const amount = req.body.amount;
  if(typeof(amount)!=="number")
  {
    return res.json({
      "error":"Amount must be number"
    })
  }
  if(amount<=0)
  {
    return res.json({
      "error":"Amount must be greater than 0"
    })
  }
  users[username].balance += amount;
  saveUsers();
  return res.json({
    "message":"Deposit successful",
    "balance":users[username].balance
  })
})

app.post("/withdraw",(req,res)=>{
  const username = req.body.username;
  if(!userExists(username))
  {
    return res.json({
      "error" : "Username not found"
    })
  }
  const amount = req.body.amount;
  if(typeof(amount)!=="number")
  {
    return res.json({
      "error" : "Amount should be a number"
    })
  }
  if(amount<=0)
  {
    return res.json({
      "error" : "Amount should be greater than 0"
    })
  }
  if(amount>users[username].balance)
  {
    return res.json({
      "error" : "Insufficient Balance"
    })
  }
  users[username].balance -= amount;
  saveUsers();
  res.json({
    "message":"Amount Withdraw Successful",
    "Balance":users[username].balance
  })

})

app.get("/leaderboard",(req,res)=>{
    const entries = Object.entries(users);
    const leaderboard = entries.map((entry)=>{
      return {
        username: entry[0],
        balance: entry[1].balance
      }
    });

    const sorted = leaderboard.sort((a,b)=>{
      return b.balance-a.balance;
    });
    res.json(sorted);
  })
app.listen(PORT,()=>{
  console.log( `Server running on ${PORT}`)
});