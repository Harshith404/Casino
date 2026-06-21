import {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
function Dashboard()
{   
   
    const [depositAmount,setDepositAmount] = useState("");
    const [withdrawAmount,setWithdrawAmount] = useState("");
    const [guess,setGuess] = useState("");
    const [betAmount,setBetAmount] = useState("");
    const [coinResult,setCoinResult] = useState("");
    const [profit,setProfit] = useState(0);
    const [won,setWon] = useState("");
    const [error,setError] = useState("");
    const navigate = useNavigate();
    const {user,setUser} = useAuth();
    if(!user)
    {
        return <h1>Loading...</h1>;
    }


     async function handleDeposit()
{
    try
    {
        const response = await api.post(
            "/deposit",
            {
                amount:Number(depositAmount)
            }
        );

        setUser({
            ...user!,
            balance:response.data.balance
        });

        setDepositAmount("");
        setError("");
    }
    catch(error:any)
    {
        setError(
            error.response?.data?.error
            || "Deposit failed"
        );
    }
}


   async function handleWithdraw()
{
    try
    {
        const response = await api.post(
            "/withdraw",
            {
                amount:Number(withdrawAmount)
            }
        );

        setUser({
            ...user!,
            balance:response.data.balance
        });

        setWithdrawAmount("");
        setError("");
    }
    catch(error:any)
    {
        setError(
            error.response?.data?.error
            || "Withdraw failed"
        );
    }
}

  async function handleCoinFlip()
{
    if(guess === "")
    {
        setError("Guess to Flip a Coin");
        setWon("");
        setCoinResult("");
        setProfit(0);
        return;
    }

    try
    {
        const response = await api.post(
            "/coinflip",
            {
                bet:Number(betAmount),
                guess:guess
            }
        );

        const data = response.data;

        setCoinResult(data.coin);
        setProfit(data.profit);
        setUser({
            ...user!,
            balance:data.balance
        });

        setBetAmount("");
        setError("");
        setGuess("");

        if(data.won)
        {
            setWon("YOU WON");
        }
        else
        {
            setWon("YOU LOST");
        }
    }
    catch(error:any)
    {
        setError(
            error.response?.data?.error
            || "Coin Flip failed"
        );

        setWon("");
        setCoinResult("");
        setProfit(0);
    }
}


    function handleLogout()
    {
        localStorage.removeItem("token");
        setUser(null);
        navigate("/");
    }

    return (
        <div>
      <h1>Welcome {user.username}</h1>
      <h2>Balance: {user.balance}</h2>
      {user.role === "admin" && (
  <button onClick={() => navigate("/admin")}>
    Admin Panel
  </button>
)}
      <br></br>
       <button onClick={() => navigate("/history")}>
      History
      </button>
        <button onClick={() => navigate("/leaderboard")}>
        Leaderboard
      </button>
      <button onClick={() => navigate("/profile")}>
        Profile
      </button>
      <br></br>
      <br></br>
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

export default Dashboard;