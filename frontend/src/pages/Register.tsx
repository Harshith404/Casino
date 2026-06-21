import {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import api from "../api/axios";
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
        try
        {
            const response = await api.post(
                "/register",
                { username,password
                }
            );
            setMessage(
                response.data.message
            );
            setError("");
            navigate("/");
        }
        catch(error:any)
        {
            setMessage("");
            setError(
                error.response?.data?.error
                || "Register failed"
            );
        }
    }
    return (<div>
        <h1>Register</h1>
        <p>Username:</p>
        <input placeholder="Username"value = {username} onChange={(event)=>setUsername(event.target.value)}/>
        <br></br>
        <p>Password:</p>
        <input type="password" placeholder="Password"value = {password} onChange={(event)=>setPassword(event.target.value)}/>
        <br></br>
        <br></br>
        <button onClick={() => {
            setUsername("");
            setPassword("");
            setError("");
            setMessage("");
        }}>Clear</button>
        <button onClick={handleRegister}>Register</button>
        <button onClick={() => navigate("/")}>Back To Login</button>
        <br></br>
        <p>{error}</p>
        <p>{message}</p>
    </div>);
}

export default Register;