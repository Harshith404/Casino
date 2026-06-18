import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login()
  { const [username,setUsername] = useState("");
    const [password,setPassword] = useState("");
    const [error,setError] = useState("");
    const [message,setMessage] = useState("");
    const navigate = useNavigate();
  
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
    setMessage(data.message);
    setError("");
    navigate("/dashboard");}
    else{
      setMessage("");
      setError(data.error);
    }
  }
  return (
     <div>
      <h1>Login</h1>
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

export default Login;