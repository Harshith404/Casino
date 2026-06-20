const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Transaction = require("../models/Transaction");
async function loginUser(req,res)
{
  const username = req.body.username;
    const password = req.body.password;
    const user = await User.findOne({
      username:username
    })
    if(!user)
    {
      return res.status(401).json({
        error:"Invalid username or password"
      })
    }
    const validPassword = await bcrypt.compare(
      password,user.password
    )
    if(!validPassword)
    {
      return res.status(401).json({
        error:"Invalid username or password"
      })
    }
    const token = jwt.sign({
      userId:user._id
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
    return res.status(400).json({
      error:"Password is required"
    });
  }
  const hashedPassword = await bcrypt.hash(password,10);
  const user = await User.findOne({
  username:username
})
  if (user)
  {
    return res.status(409).json({
      "error":"User already exists"
    })
  }
  const newUser = new User({
    username:username,
    password:hashedPassword,
    balance:1000,
    role:"user"
  })
  await newUser.save();
  res.json({
    "message":"User created"
  })
  
}

async function getMe(req,res)
{
    res.json({
        username:req.user.username,
        balance:req.user.balance,
        role:req.user.role
    });
}

async function coinFlip(req,res)
{
  const user = req.user;
const username = user.username;
    const bet = req.body.bet;
    if(typeof(bet)!=="number")
    { 
      return res.status(400).json({
         "error" : "Bet must be a number"
        })
      }
    
    if(bet<=0)
    {
      return  res.status(400).json({
        "error":"Bet must be greater than 0"
      })
    }
    if(bet > user.balance)
  {
    return res.status(400).json({
      error: "Insufficient Balance"
    });
  }
    const guess = req.body.guess;
    if(guess!=="Heads" && guess!=="Tails")
    {
      return res.status(400).json({
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
      await Transaction.create({
            username: username,
            type: "coinflip-win",
            amount: bet,
            balanceAfter: user.balance
        });
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
        await Transaction.create({
            username: username,
            type: "coinflip-loss",
            amount: bet,
            balanceAfter: user.balance
        });
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
    const user = req.user;
    const username = user.username;
    const amount = req.body.amount;
    if(typeof(amount)!=="number")
    {
      return res.status(400).json({
        "error":"Amount must be number"
      })
    }
    if(amount<=0)
    {
      return res.status(400).json({
        "error":"Amount must be greater than 0"
      })
    }
    user.balance += amount;
    await user.save();
    await Transaction.create({
      username:username,
      type:"deposit",
      amount:amount,
      balanceAfter:user.balance
    });
    return res.json({
      "message":"Deposit successful",
      "balance":user.balance
    })
}

async function withdraw(req,res)
{
  const user = req.user;
  const username = user.username;
    const amount = req.body.amount;
    if(typeof(amount)!=="number")
    {
      return res.status(400).json({
        "error" : "Amount should be a number"
      })
    }
    if(amount<=0)
    {
      return res.status(400).json({
        "error" : "Amount should be greater than 0"
      })
    }
    if(amount>user.balance)
    {
      return res.status(400).json({
        "error" : "Insufficient Balance"
      })
    }
    user.balance -= amount;
    await user.save();
    await Transaction.create({
      username:username,
      type:"withdraw",
      amount:amount,
      balanceAfter:user.balance
    });
    res.json({
      "message":"Amount Withdraw Successful",
      "balance":user.balance
    })
  
}

async function leaderboard(req,res)
{
  const user = await User.find().sort({
      balance:-1
    });
    res.json(user);
}

async function getTransactions(req,res)
{
    const username = req.user.username;
    const transactions =
        await Transaction.find({
            username: username
        }).sort({
            createdAt: -1
        });

    res.json(transactions);
}

async function getAllUsers(req,res)
{
    const users = await User.find();
    res.json(users);
}

async function getAdminStats(req,res)
{
    const totalUsers = await User.countDocuments();
    const users = await User.find();
    const totalMoney = users.reduce(
        (sum,user) => sum + user.balance,
        0
    );
    const richestUser = await User.findOne()
        .sort({ balance: -1 });
    res.json({
        totalUsers,
        totalMoney,
        richestUser: richestUser.username,
        richestBalance: richestUser.balance
    });
}

module.exports = {
  loginUser,
  registerUser,
  getMe,
  coinFlip,
  deposit,
  withdraw,
  leaderboard,
  getTransactions,
  getAllUsers,
  getAdminStats
};