import {useState} from 'react';
import {useEffect} from 'react';
function App()
{ const [username,setUsername] = useState("");
  const [password,setPassword] = useState("");
  const [error,setError] = useState("");
  const [message,setMessage] = useState("");
  const [isLoggedIn,setIsLoggedIn] = useState(
  !!localStorage.getItem("token")
);

useEffect(() => {console.log("App Loaded");},[]);
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
  if(isLoggedIn)
  {
    return(
    <div>
      <h1>Welcome {username}</h1>
      <button onClick={handleLogout}>Logout</button>
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