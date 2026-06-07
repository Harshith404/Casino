require("dotenv").config();
const mongoose = require("mongoose");
const MONGO_URI =process.env.MONGO_URI;
mongoose.connect(MONGO_URI)
.then(() => {
    console.log("MongoDB Connected");
})
.catch((err) => {
    console.log(err);
});

const User = require("./models/User");
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const app = express();
app.use(express.json());
const PORT = 3500;

function auth(req,res,next)
{
  const token = req.body.token;
  if(!token)
{
    return res.json({
        error: "Token required"
    });
}
try{
  const decoded = jwt.verify(
    token,
    process.env.JWT_SECRET
);
  req.user = decoded;
  next();
}
catch(err)
{
  return res.json({
    error:"Invalid token"
  })
}
}

app.post("/user",auth,async (req,res)=>{
  const username = req.user.username;
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

app.post("/coinflip",auth,async (req,res)=>{
  const username = req.user.username;
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
  const password = req.body.password;
  if(!password)
  {
    return res.json({
      error:"Password is required"
    });
  }
  const hashedPassword = await bcrypt.hash(password,10);
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
    password:hashedPassword,
    balance:1000
  })
  await newUser.save();
  res.json({
    "message":"User created"
  })
  
})
app.post("/login",async (req,res)=>{
  const username = req.body.username;
  const password = req.body.password;
  const user = await User.findOne({
    username:username
  })
  if(!user)
  {
    return res.json({
      error:"Invalid username or password"
    })
  }
  const validPassword = await bcrypt.compare(
    password,user.password
  )
  if(!validPassword)
  {
    return res.json({
      error:"Invalid username or password"
    })
  }
  const token = jwt.sign({
    username:user.username
  },
process.env.JWT_SECRET,
{
  expiresIn:"1h"
});
  res.json({
  message: "Login successful",
  token:token
});
})

app.post("/secret",auth,(req,res)=>{
  res.json({
    message:"Secret route",
    user:req.user
  });
});

app.post("/deposit",auth,async (req,res)=>{
  const username = req.user.username;
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

app.post("/withdraw",auth,async (req,res)=>{
  const username = req.user.username;
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