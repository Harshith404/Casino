import { useState,useEffect } from "react";
import api from "../api/axios";

type User = {
    _id: string;
    username: string;
    balance: number;
    role: string;
};

function Admin()
{   const [users,setUsers] = useState<User[]>([]);
  const [totalUsers,setTotalUsers] = useState(0);
  const [totalMoney,setTotalMoney] = useState(0);
  const [richestUser,setRichestUser] = useState("");
  const [richestBalance,setRichestBalance] = useState(0);
    async function fetchAdminUsers()
    {
        try
        {
            const response =
            await api.get("/admin/users");

            setUsers(response.data);
        }
        catch(error)
        {
            console.log(error);
        }
    }  
      
    async function fetchAdminStats()
{
    try
    {
        const response =
        await api.get("/admin/stats");

        const data = response.data;

        setTotalUsers(data.totalUsers);
        setTotalMoney(data.totalMoney);
        setRichestUser(data.richestUser);
        setRichestBalance(data.richestBalance);
    }
    catch(error)
    {
        console.log(error);
    }
}

      useEffect(() => {fetchAdminUsers();
        fetchAdminStats();
      }, []);

    return (<div>
      <h1>Admin Panel</h1>
      <h2>Total Users: {totalUsers}</h2>
      <h2>Total Money: {totalMoney}</h2>
      <h2>Richest User: {richestUser}</h2>
      <h2>Richest Balance: {richestBalance}</h2>
       {
      users.map((user,index) => (
        <div key={user._id}>
          <p>
            #{index+1}
            {" | "}
            Username: {user.username}
            {" | "}
            Balance: {user.balance}
            {"|"}
            Role: {user.role}
          </p>

          <hr />
          </div>))
     }
    </div>);
}

export default Admin;