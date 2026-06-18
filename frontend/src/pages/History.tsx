import {useState,useEffect} from 'react';
function History()
{   
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