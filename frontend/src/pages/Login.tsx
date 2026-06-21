import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
function Login()
  { const [username,setUsername] = useState("");
    const [password,setPassword] = useState("");
    const [error,setError] = useState("");
    const [message,setMessage] = useState("");
    const navigate = useNavigate();
    useEffect(() => {
    const token = localStorage.getItem("token");

    if(token)
    {
        navigate("/dashboard");
    }
}, [navigate]);
  async function handlelogin()
  { if(!username || !password)
  { setMessage("");
    setError("Please enter Username and Password");
    return;
  }
    setError("");
   try
{
    const response = await api.post(
        "/login",
        {username,password}
    );
    const data = response.data;
    localStorage.setItem("token",data.token);

    setMessage(data.message);
    setError("");
    navigate("/dashboard");
}
catch(error:any)
{
    setMessage("");
    setError(error.response?.data?.error || "Login failed");
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
       <br></br>
      <button onClick={()=>{setUsername("");
        setPassword("");
        setError("");
        setMessage("");
        }}>Clear</button>
      <button onClick={handlelogin}>Login</button>
      <button onClick={() => navigate("/register")}>Register</button>
      <p>{error}</p>
      <p>{message}</p>
    </div>
  );
}

export default Login;