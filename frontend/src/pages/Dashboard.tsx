import {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
function Dashboard()
{   const [username,setUsername] = useState("");
    const [balance,setBalance] = useState(0);
    const [depositAmount,setDepositAmount] = useState("");
    const [withdrawAmount,setWithdrawAmount] = useState("");
    const [guess,setGuess] = useState("");
    const [betAmount,setBetAmount] = useState("");
    const [coinResult,setCoinResult] = useState("");
    const [profit,setProfit] = useState(0);
    const [won,setWon] = useState("");
    type Transaction = {
    _id: string;
    username: string;
    type: string;
    amount: number;
    balanceAfter: number;
    };
    const [transactions,setTransactions] = useState<Transaction[]>([]);
    const [error,setError] = useState("");
    const navigate = useNavigate();
    
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


  async function fetchTransactions(){
    const token = localStorage.getItem("token");

    if(!token)
    {
      return;
    }

    const response = await fetch(
      "https://casino-ubcn.onrender.com/transactions",
      {
        method:"GET",
        headers:{
          Authorization:`Bearer ${token}`
        }
      }
    );

    const data  = await response.json();

    setTransactions(data);
    console.log(transactions);
  }

    function handleLogout()
    {
        localStorage.removeItem("token");
        navigate("/");
    }

    return (
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
      <button onClick={fetchTransactions}>Show Transactions</button>
      
      {
  transactions.map((transaction) => (
    <div key={transaction._id}>
  <p>
    {transaction.type}
    {" | "}
    Amount: {transaction.amount}
    {" | "}
    Balance: {transaction.balanceAfter}
  </p>
  <hr />
    </div>
  ))
}

      <br></br>
      <br></br>
      <button onClick={handleLogout}>Logout</button>
      <p>{error}</p>
    </div>
    );
}

export default Dashboard;