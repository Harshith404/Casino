import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
type User ={
    _id:string;
    username:string;
    balance:number;
};

function Leaderboard()
{   const navigate= useNavigate();
    const [users,setUsers] = useState<User[]>([]);

    async function fetchLeaderboard()
{
    try
    {
        const response =
        await api.get("/leaderboard");

        setUsers(response.data);
    }
    catch(error)
    {
        console.log(error);
    }
}
    useEffect(() => {fetchLeaderboard();}, []);
    return (
    <div>
        <h1>Leaderboard</h1>
        <button onClick={() => navigate("/dashboard")}>
          Dashboard
        </button>

        <button onClick={() => navigate("/history")}>
            History
        </button>
        <br></br>
        <br></br>
     {
      users.map((user,index) => (
        <div key={user._id}>
          <p>
            #{index+1}
            {" | "}
            Username: {user.username}
            {" | "}
            Balance: {user.balance}
          </p>

          <hr />
          </div>))
     }
    </div>);
}

export default Leaderboard;