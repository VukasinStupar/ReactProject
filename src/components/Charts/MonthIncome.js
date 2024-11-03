import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Navbar from "../Navbar";


const MonthIncome = () => {
  const [data, setData] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/reservations/getMonthIncomes",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token || "",
          },
        }
      );
      const data = await response.json();
      setData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div style={{ width: "100vw", height: "500px" }}>
      <Navbar />
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        <div style={{ width: "65%", textAlign: "center", marginTop: '100px' }}>
          <h3>Number of reservations per equipment</h3>
          <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="income"
            stroke="#82ca9d"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
        </div>
      </div>

     
    </div>
  );
};

export default MonthIncome;