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