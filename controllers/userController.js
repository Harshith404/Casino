const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

async function loginUser(req,res)
{
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
}

async function registerUser(req,res)
{
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
  
}

async function getUser(req,res)
{
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
}

async function coinFlip(req,res)
{
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
}

async function deposit(req,res)
{
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
}

async function withdraw(req,res)
{
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
  
}

async function leaderboard(req,res)
{
  const user = await User.find().sort({
      balance:-1
    });
    res.json(user);
}
module.exports = {
  loginUser,
  registerUser,
  getUser,
  coinFlip,
  deposit,
  withdraw,
  leaderboard
};