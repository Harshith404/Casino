const mongoose = require("mongoose");
const MONGO_URI =
"mongodb://Harshith:Harshith404@ac-g2i75ed-shard-00-00.kkay17y.mongodb.net:27017,ac-g2i75ed-shard-00-01.kkay17y.mongodb.net:27017,ac-g2i75ed-shard-00-02.kkay17y.mongodb.net:27017/?ssl=true&replicaSet=atlas-p5472p-shard-0&authSource=admin&appName=Cluster0";
mongoose.connect(MONGO_URI)
.then(() => {
    console.log("MongoDB Connected");
})
.catch((err) => {
    console.log(err);
});

const User = require("./models/User");

const express = require("express");

const app = express();
app.use(express.json());
const PORT = 3500;

app.get("/user/:username",async (req,res)=>{
  const username = req.params.username;
  const user = await User.findOne({
    username:username
  })
  if(!user)
  {
    return res.json({
      "error":"User not found"
    })
  }
  res.json({
    balance:user.balance
  });
});

app.get("/",(req,res)=>{
  res.send("Casino Backend Running");
});

app.post("/coinflip",async (req,res)=>{
  const username = req.body.username;
  const user = await User.findOne({username:username});
  if(!user) {
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
  if(bet > user.balance)
{
  return res.json({
    error: "Insufficient Balance"
  });
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
    user.balance+=bet;
    await user.save();
    res.json({
      "won":true,
      "coin":face,
      "profit":bet,
      "balance":user.balance
    })
  }
    else{
      user.balance-=bet;
      await user.save();
      res.json({
        "won":false,
        "coin":face,
        "profit":-bet,
        "balance":user.balance
      })
    }
})

app.post("/register", async (req,res)=>{
  const username = req.body.username;
  const user = await User.findOne({
  username:username
})
  if (user)
  {
    return res.json({
      "error":"User already exists"
    })
  }
  const newUser = new User({
    username:username,
    balance:1000
  })
  await newUser.save();
  res.json({
    "message":"User created"
  })
  
})

app.post("/deposit",async (req,res)=>{
  const username = req.body.username;
  const user = await User.findOne({
    username:username
  })
  if(!user)
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
  user.balance += amount;
  await user.save();

  return res.json({
    "message":"Deposit successful",
    "balance":user.balance
  })
})

app.post("/withdraw",async (req,res)=>{
  const username = req.body.username;
  const user = await User.findOne({
    username:username
  })
  if(!user)
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
  if(amount>user.balance)
  {
    return res.json({
      "error" : "Insufficient Balance"
    })
  }
  user.balance -= amount;
  await user.save();
  res.json({
    "message":"Amount Withdraw Successful",
    "Balance":user.balance
  })

})

app.get("/leaderboard",async (req,res)=>{
    const user = await User.find().sort({
      balance:-1
    });
    res.json(user);
  })
app.listen(PORT,()=>{
  console.log( `Server running on ${PORT}`)
});