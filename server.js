const express = require("express");

const app = express();
app.use(express.json());
const PORT = 3500;

app.get("/",(req,res)=>{
  res.send("Casino Backend Running");
});

/* app.get("/user",(req,res)=>{
  res.json({
      username:"harshith",
      balance:1000
  })
})

app.get("/dice",(req,res)=>{
  const roll = Math.floor(Math.random()*6)+1;

  res.json({
    roll:roll
  })
})
 */
/* app.get("/coinflip",(req,res)=>{
  const win = Math.random()>0.45;
  let coin;
  if (win){
    coin = "Heads";
  }
  else {
    coin = "Tails";
  }
  res.json({
    Coin:coin
  })
}) */

app.post("/coinflip",(req,res)=>{

  const bet = req.body.bet;
  const guess = req.body.guess;
  const coin = Math.random();
  let face;
  if (coin>0.5){
    face="Heads";
  }
  else{
    face="Tails";
  }
  if(guess===face){
    res.json({
      "won":true,
      "coin":face,
      "profit":bet
    })
  }
    else{
      res.json({
        "won":false,
        "coin":face,
        "profit":-bet
      })
    }
})

app.listen(PORT,()=>{
  console.log( `Server running on ${PORT}`)
});