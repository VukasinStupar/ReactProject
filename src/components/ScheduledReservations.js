import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ScheduledReservations.css";
import Navbar from "./Navbar";

const ScheduledReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState(null); // State for error handling
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/reservations/scheduledReservationsForAdminsCompany', {
        
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: token,
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setReservations(data);
    } catch (error) {
      console.error("Error fetching reservations:", error);
      setError("Failed to fetch reservations. Please try again later.");
    }
  };

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

  const handleReservationClick = (id) => {
    navigate(`/takeReservation/${id}`);
  };

  if (error) {
    return <div className="error-message">{error}</div>; // Show error message
  }

  return (
    <div className="container">
      <Navbar />
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Status</th>
              <th>Date and Time</th>
              <th>Duration</th>
              <th>Company Name</th>
              <th>Admin Full Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((reservation) => (
              <tr key={reservation.id}>
                <td>{reservation.user}</td>
                <td>{reservation.status}</td>
                <td>{formatDate(reservation.dateAndTime)}</td>
                <td>{reservation.duration}</td>
                <td>{reservation.companyName}</td>
                <td>{reservation.adminFullName}</td>
                <td>
                  <button onClick={() => handleReservationClick(reservation.id)}>
                    Take reservation
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ScheduledReservations;
