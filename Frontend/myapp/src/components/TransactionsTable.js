import React, { useState, useEffect } from "react";
import axios from "axios";
import './styles.css';


const TransactionsTable = ({ month }) => {
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [perPage] = useState(10); // Default per page


  useEffect(() => {
    const fetchTransactions = async () => {
        try {
          const response = await axios.get(
            `http://localhost:8000/api/transactions?month=${month}&page=${page}&perPage=${perPage}&search=${search}`
          );
          setTransactions(response.data.transactions);
        } catch (error) {
          console.error("Error fetching transactions:", error);
        }
      };
    fetchTransactions();
  }, [month, search, page, perPage]);

  return (
    <div>
        <h3 className="search">Transactions</h3>
        <input className="searchbox" type="text" placeholder="Search transactions..." value={search} onChange={(e) => setSearch(e.target.value)} />
     <div className="table">
      <table  border="1">
        <thead>
          <tr >
            <th>ID</th>
            <th>Title</th>
            <th>Description</th>
            <th>Price</th>
            <th>Category</th>
            <th>Date of Sale</th>
          </tr>
        </thead>
        <tbody>
            <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
        </tbody>
        <tbody>
            <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
        </tbody>
        <tbody>
            <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
        </tbody>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id}>
              <td>{transaction.title}</td>
              <td>{transaction.description}</td>
              <td>{transaction.price}</td>
              <td>{transaction.dateOfSale}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="btn">
      <button className="btn1" onClick={() => setPage(page > 1 ? page - 1 : 1)}>Previous</button>
      <button className="btn1" onClick={() => setPage(page + 1)}>Next</button>
      </div>
    </div>
     </div>
  );
};

export default TransactionsTable;
