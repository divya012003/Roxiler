import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import axios from "axios";
import './styles.css';



// Register the required components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);


const BarChart = ({ month }) => {
  const [barData, setBarData] = useState({});

//   const fetchBarChartData = async () => {
//     try {
//       const response = await axios.get(
//         `http://localhost:8000/api/bar-chart?month=${month}`
//       );
//       setBarData(response.data);
//     } catch (error) {
//       console.error("Error fetching bar chart data:", error);
//     }
//   };

  useEffect(() => {
    const fetchBarChartData = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/bar-chart?month=March`);
        setBarData(response.data);
      } catch (error) {
        console.error("Error fetching bar chart data:", error);
      }
    };
  
    fetchBarChartData();
  }, []); // Empty dependency array because everything is defined inside
  

  const chartData = {
    labels: Object.keys(barData),
    datasets: [
      {
        label: "Number of Items",
        data: Object.values(barData),
        backgroundColor: "rgba(75,192,192,0.6)",
      },
    ],
  };

  return (
    <div className="barchart">
      <h3>Bar Chart</h3>
      <Bar data={chartData} />
    </div>
  );
};

export default BarChart;
