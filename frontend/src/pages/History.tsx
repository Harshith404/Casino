import {useState,useEffect} from 'react';
import { useNavigate } from "react-router-dom";
function History()
{   const navigate = useNavigate();
     async function fetchTransactions(){
    const token = localStorage.getItem("token");

    if(!token)
    {
      return;
    }

    const response = await fetch(
      "https://casino-ubcn.onrender.com/transactions",
      {
        method:"GET",
        headers:{
          Authorization:`Bearer ${token}`
        }
      }
    );

    const data  = await response.json();

    setTransactions(data);
  }    

    useEffect(() => {
        fetchTransactions();
    }, []);

    type Transaction = {
    _id: string;
    username: string;
    type: string;
    amount: number;
    balanceAfter: number;
    };
    const [transactions,setTransactions] = useState<Transaction[]>([]);
    return (
  <div>
    <h1>Transaction History</h1>
      <button onClick={() => navigate("/dashboard")}>
      Dashboard
      </button>

      <button onClick={() => navigate("/leaderboard")}>
      Leaderboard
      </button>
    {
      transactions.map((transaction) => (
        <div key={transaction._id}>
          <p>
            {transaction.type}
            {" | "}
            Amount: {transaction.amount}
            {" | "}
            Balance: {transaction.balanceAfter}
          </p>

          <hr />
        </div>
      ))
    }

  </div>
);
}

export default History;