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

const ProductsIncome = () => {
  const [data, setData] = useState([]);
  const [productKeys, setProductKeys] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/reservations/getMonthIncomeForEachEquipment",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token || "",
          },
        }
      );
      const rawData = await response.json();

      // Transform the data for recharts
      const formattedData = rawData.map((item) => {
        const incomeObject = { month: item.month };
        item.incomes.forEach((income) => {
          incomeObject[income.name] = parseFloat(income.income);
        });
        return incomeObject;
      });

      // Extract product keys dynamically from the first data point
      const products = rawData[0]?.incomes.map((income) => income.name) || [];

      setData(formattedData);
      setProductKeys(products);
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
        <div style={{ width: "65%", textAlign: "center", marginTop: "100px" }}>
          <h3>Monthly Income per Product</h3>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />

              {/* Dynamically create Line components for each product */}
              {productKeys.map((product, index) => (
                <Line
                  key={index}
                  type="monotone"
                  dataKey={product}
                  stroke={index % 2 === 0 ? "#8884d8" : "#82ca9d"}
                  strokeWidth={3}
                  name={product}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ProductsIncome;
