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

// Helper function to format date arrays
const formatDate = (dateArray) => {
  const [year, month, day, hour, minute] = dateArray;
  const date = new Date(year, month - 1, day, hour, minute);
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const ReservationCountForYear = () => {
  const [data, setData] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/reservations/getReservationCountForYear",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token || "", // Token from localStorage
          },
        }
      );

      const rawData = await response.json();

      // Properly format the date arrays using formatDate function
      const formattedData = rawData.map((item) => ({
        ...item,
        startDate: item.month, // Format startDate using the helper function
      }));

      setData(formattedData);
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
        <div style={{ width: "95%", textAlign: "center", marginTop: "100px" }}>
          <h3>Number of reservations for the past year</h3>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip
                content={({ payload }) => {
                  if (payload && payload.length) {
                    const item = payload[0].payload;
                    return (
                      <div
                        style={{
                          backgroundColor: "#fff",
                          border: "1px solid #ccc",
                          padding: "10px",
                        }}
                      >
                        <p>
                          <strong>Start Date:</strong> {item.month}
                        </p>
                        <p>
                          <strong>Reservation Count:</strong>{" "}
                          {item.reservationCount}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="reservationCount"
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

export default ReservationCountForYear;
