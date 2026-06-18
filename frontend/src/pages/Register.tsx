import {useState} from 'react';
import { useNavigate } from 'react-router-dom';
function Register()
{   const [username,setUsername] = useState("");
    const [password,setPassword] = useState("");
    const [error,setError] = useState("");
    const [message,setMessage] = useState("");
    const navigate = useNavigate();

    async function handleRegister(){
        if(!username || !password)
        { setMessage("");
            setError("Please enter Username and Password");
            return;
        }
        setError("");
        const response = await fetch(
        "https://casino-ubcn.onrender.com/register",{method:"POST",
            headers:{"Content-Type":"application/json"},
            body: JSON.stringify({
            username: username,
            password: password
            })
        }
        );  
    const data = await response.json();
    if(data.error)
    {   
        setMessage("");
        setError(data.error);   
    }
    else{
        setMessage(data.message);
        setError("");
        navigate("/");
    }
    }
    return (<div>
        <h1>Register Page</h1>
        <p>Username:</p>
        <input placeholder="Username"value = {username} onChange={(event)=>setUsername(event.target.value)}/>
        <br></br>
        <p>Password:</p>
        <input type="password" placeholder="Password"value = {password} onChange={(event)=>setPassword(event.target.value)}/>
        <br></br>
        <p>{error}</p>
        <br></br>
        <p>{message}</p>
        <br></br>
        <br></br>
        <button onClick={() => {
            setUsername("");
            setPassword("");
            setError("");
            setMessage("");
        }}>Clear</button>
        <button onClick={handleRegister}>Register</button>
    </div>);
}

export default Register;