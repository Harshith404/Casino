import {useState, useEffect} from 'react';
function App()
{ const [username,setUsername] = useState("");
  const [password,setPassword] = useState("");
  const [error,setError] = useState("");
  const [message,setMessage] = useState("");
  const [isLoggedIn,setIsLoggedIn] = useState(
  !!localStorage.getItem("token")
);
  const [balance,setBalance] = useState(0);
  const [depositAmount,setDepositAmount] = useState("");
const [withdrawAmount,setWithdrawAmount] = useState("");
const [guess,setGuess] = useState("");
const [betAmount,setBetAmount] = useState("");
const [coinResult,setCoinResult] = useState("");
const [profit,setProfit] = useState(0);
const [won,setWon] = useState("");


useEffect(() => {
  async function fetchUser()
  {
    const token = localStorage.getItem("token");

    if(!token)
    {
      return;
    }

    const response = await fetch(
      "https://casino-ubcn.onrender.com/user",
      {
        method:"POST",
        headers:{
          Authorization: `Bearer ${token}`
        }
      }
    );

    const data = await response.json();

    console.log(data);

    setUsername(data.username);
    setBalance(data.balance);
  }

  fetchUser();
},[]);

  async function handlelogin()
  { if(!username || !password)
  { setMessage("");
    setError("Please enter Username and Password");
    return;
  }
    setError("");
    const response = await fetch(
  "https://casino-ubcn.onrender.com/login",{method:"POST",
    headers:{"Content-Type":"application/json"},
    body: JSON.stringify({
      username: username,
      password: password
    })
  }
);  
    const data = await response.json();
    if(data.token){
    localStorage.setItem("token",data.token);
      setMessage(data.message)
      setIsLoggedIn(true);
    setError("");}
    else{
      setMessage("");
      setError(data.error);
    }
  }

   function handleLogout()
{
  localStorage.removeItem("token");
  setIsLoggedIn(false);
}

  async function handleDeposit()
  {
    const token = localStorage.getItem("token");

    if(!token)
    {
      return;
    }
      const response = await fetch(
      "https://casino-ubcn.onrender.com/deposit",
      {
        method:"POST",
        headers:{
          Authorization: `Bearer ${token}`,
          "Content-Type":"application/json"
        },
        body: JSON.stringify({ amount: Number(depositAmount)})
        }
    );

    const data = await response.json();
    if(data.error)
    {
      setError(data.error);
      return;
    }
    setBalance(data.balance);
    setDepositAmount("");
    setError("");
  }
    async function handleWithdraw()
  {
    const token = localStorage.getItem("token");

    if(!token)
    {
      return;
    }
      const response = await fetch(
      "https://casino-ubcn.onrender.com/withdraw",
      {
        method:"POST",
        headers:{
          Authorization: `Bearer ${token}`,
          "Content-Type":"application/json"
        },
        body: JSON.stringify({ amount: Number(withdrawAmount)})
        }
    );

    const data = await response.json();
    if(data.error)
    {
      setError(data.error);
      return;
    }
    setBalance(data.balance);
    setWithdrawAmount("");
    setError("");
  }


  async function handleCoinFlip()
  {
    const token = localStorage.getItem("token");
    if(!token)
    {
      return;
    }
    if(guess === "")
    {
      setError("Guess to Flip a Coin");
      setWon("");
      setCoinResult("");
      setProfit(0);
      return;
    }
    const response = await fetch(
      "https://casino-ubcn.onrender.com/coinflip",
      {
        method:"POST",
        headers:{
          Authorization: `Bearer ${token}`,
          "Content-Type":"application/json"
        },
        body: JSON.stringify({ bet: Number(betAmount),
          guess: guess
        })
        }
    );
    const data = await response.json();
    if(data.error)
    {
      setError(data.error);
      setWon("");
      setCoinResult("");
      setProfit(0);
      return;
    }
    setCoinResult(data.coin);
    setProfit(data.profit);
    setBalance(data.balance);
    setBetAmount("");
    setError("");
    setGuess("");
     if(data.won=== true)
          {
            setWon("YOU WON");
          }
          if(data.won === false)
          {
            setWon("YOU LOST");
          }
  }


  if(isLoggedIn)
  {
    return(
    <div>
      <h1>Welcome {username}</h1>
      <h2>Balance: {balance}</h2>
      <p>Deposit: </p>
      <input
            placeholder="Amount"
            value={depositAmount}
            onChange={(event)=>setDepositAmount(event.target.value)}
      />
      <button onClick={handleDeposit}>Deposit</button>
      <br></br>
      <p>Withdraw: </p>
      <input
            placeholder="Amount"
            value={withdrawAmount}
            onChange={(event)=>setWithdrawAmount(event.target.value)}
      />
      <button onClick={handleWithdraw}>Withdraw</button>
      <br></br>
      <br></br>
      <h2>Flip A Coin Game:</h2>
      <p>Bet Amount : </p>
      <input placeholder="Amount"
        value ={betAmount}
        onChange={(event)=>{setBetAmount(event.target.value)}}/>
      <br></br>
      <button onClick={()=>{setGuess("Heads")}}>Heads</button>
      <button onClick={()=>{setGuess("Tails")}}>Tails</button>
      <button onClick={handleCoinFlip}>Flip Coin</button>
      <br></br>
      <p>Guess: {guess}</p>
      <p>Coin Result: {coinResult}</p>
      <p>Profit: {profit>0?"+":""}{profit}</p>
      <p>{won}</p>
      <br></br>
      <br></br>
      <button onClick={handleLogout}>Logout</button>
      <p>{error}</p>
    </div>

    );
  }
  return (
    <div>
      
      <p>Username: </p>
      <input placeholder="Username" value={username} onChange={(event)=>{setUsername(event.target.value)}}/>
      <br></br>
      <p>Password: </p>
       <input placeholder="Password" type="password" value={password} onChange={(event)=>{setPassword(event.target.value)}}/>
       <br></br>
      <button onClick={()=>{setUsername("");
        setPassword("");
        setError("");
        setMessage("");
        }}>Clear</button>
      <button onClick={handlelogin}>Login</button>
      <p>{error}</p>
      <p>{message}</p>
    </div>
  );
}

export default App;