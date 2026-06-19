import { useState,useEffect } from "react";

type User = {
    _id: string;
    username: string;
    balance: number;
    role: string;
};

function Admin()
{   const [users,setUsers] = useState<User[]>([]);
   async function fetchAdminUsers(){
        const token = localStorage.getItem("token");

    if(!token)
    {
      return;
    }

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
      
      useEffect(() => {fetchAdminUsers();}, []);

    return (<div>
      <h1>Admin Panel</h1>
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