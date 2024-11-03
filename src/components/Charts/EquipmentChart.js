import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Navbar from "../Navbar";

const generateDynamicColors = (numColors) => {
  const colors = [];
  const step = 360 / numColors;
  for (let i = 0; i < numColors; i++) {
    const hue = (i * step + 200) % 360;
    const color = `hsl(${hue}, 70%, 60%)`;
    colors.push(color);
  }
  return colors;
};

const EquipmentCharts = () => {
  const [data, setData] = useState([]);
  const [colors, setColors] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/companies/equipmentStatistics",
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
      setColors(generateDynamicColors(data.length));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div style={{ width: "100%", height: "500px" }}>
      <Navbar />
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        <div style={{ width: "45%", textAlign: "center" }}>
          <h3>Number of reservations per equipment</h3>
          <ResponsiveContainer width="100%" height={500}>
            <PieChart>
              <Pie
                dataKey="numberOfReservations"
                nameKey="equipmentName"
                isAnimationActive={false}
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={150}
                label
                labelStyle={{ fontSize: "18px" }}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-income-${index}`}
                    fill={colors[index % colors.length]}
                  />
                ))}
              </Pie>
              <Tooltip contentStyle={{ fontSize: "16px" }} />
              <Legend
                formatter={(value, entry, index) => (
                  <span style={{ color: colors[index], fontSize: "18px" }}>
                    {value}
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default EquipmentCharts;
