import { useState,useEffect } from "react";

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
   async function fetchAdminUsers(){
        const token = localStorage.getItem("token");

          const response = await fetch(
        "https://casino-ubcn.onrender.com/admin/users",
        {
          method:"GET",
          headers:{
          Authorization: `Bearer ${token}`
        }
        }
      );
      const data  = await response.json();
      
      setUsers(data);
    }    
      
    async function fetchAdminStats()
{
    const token = localStorage.getItem("token");
    if(!token)
    {
        return;
    } 
    const response = await fetch(
        "https://casino-ubcn.onrender.com/admin/stats",
        {
            method:"GET",
            headers:{
                Authorization:`Bearer ${token}`
            }
        }
    );
    const data = await response.json();
    setTotalUsers(data.totalUsers);
    setTotalMoney(data.totalMoney);
    setRichestUser(data.richestUser);
    setRichestBalance(data.richestBalance);
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