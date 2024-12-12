import React, { useState, useEffect } from "react";
import axios from "axios";
import './styles.css';


const Statistics = ({ month }) => {
  const [stats, setStats] = useState({});

  

  useEffect(() => {
    const fetchStatistics = async () => {
        try {
          const response = await axios.get(
            `http://localhost:8000/api/statistics?month=${month}`
          );
          setStats(response.data);
        } catch (error) {
          console.error("Error fetching statistics:", error);
        }
      };
    fetchStatistics();
  }, [month]);

  return (
    <div className="api">
      <h3 className="api1">Statistics</h3>
      <p className="api1">Total Sale Amount: {stats.totalSales}</p>
      <p className="api1">Total Sold Items: {stats.totalSoldItems}</p>
      <p className="api1">Total Unsold Items: {stats.totalUnsoldItems}</p>
    </div>
  );
};

export default Statistics;
