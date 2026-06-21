import {useState,useEffect} from 'react';
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
function History()
{   const navigate = useNavigate();
     async function fetchTransactions()
{
    try
    {
        const response =
        await api.get("/transactions");

        setTransactions(response.data);
    }
    catch(error)
    {
        console.log(error);
    }
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