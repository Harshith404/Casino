import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
type User ={
    _id:string;
    username:string;
    balance:number;
};

function Leaderboard()
{   const navigate= useNavigate();
    const [users,setUsers] = useState<User[]>([]);

    async function fetchLeaderboard(){

        const response = await fetch(
      "https://casino-ubcn.onrender.com/leaderboard",
      {
        method:"GET",
      }
    );

    const data  = await response.json();

    setUsers(data);
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