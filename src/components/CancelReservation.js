import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/cancelReservation.css";
import Navbar from "./Navbar";

const CancelReservation = () => {
  const { id } = useParams(); // Get the reservation ID from the URL parameters
  const token = localStorage.getItem("token"); // Retrieve the token from local storage
  const [reservation, setReservation] = useState(null); // State for storing a single reservation
  const [equipment, setEquipments] = useState([]); // State for storing equipment (now an array)
  const [error, setError] = useState(null); // State for error handling

  useEffect(() => {
    fetchReservation();
    fetchEquipment();
  }, [id]); // Fetch reservation and equipment whenever the ID changes

  const fetchReservation = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/reservations/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: token, // Correctly format the Authorization header
          },
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log("Fetched ReservationById:", data);
      setReservation(data); // Set the reservation data
    } catch (error) {
      console.error("Error fetching reservation:", error);
      setError("Failed to fetch reservation. Please try again later.");
    }
  };

  const fetchEquipment = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/reservations/equipmentByReservationId/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: token, // Correctly format the Authorization header
          },
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log("Fetched EquipmentById:", data);
      setEquipments(data); // Set the equipment data as an array
    } catch (error) {
      console.error("Error fetching equipment:", error);
      setError("Failed to fetch equipment. Please try again later.");
    }
  };

  const handleCancel = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/reservations/cancelReservation/${reservation.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: token,
          },
          body: null,
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log("Fetched ReservationById:", data);
      setReservation(data); // Set the reservation data
    } catch (error) {
      console.error("Error cancelling reservation:", error);
      setError("Failed to cancel reservation. Please try again later.");
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

  if (error) {
    return <div className="error-message">{error}</div>; // Display error message if there was an error
  }

  if (!reservation || equipment.length === 0) {
    return <div className="loading-message">Loading...</div>; // Display a loading message while fetching
  }

  return (
    <div className="container">
      <Navbar></Navbar>
      <div className="details-wrapper">
        <h2>Reservation Details</h2>
        <div className="reservation-details">
          <p>
            <strong>Date and Time:</strong>{" "}
            {formatDate(reservation.dateAndTime)}
          </p>
          <p>
            <strong>Duration:</strong> {reservation.duration}
          </p>
          <p>
            <strong>Company Name:</strong> {reservation.companyName}
          </p>
          <p>
            <strong>Status:</strong> {reservation.status}
          </p>
          <p>
            <strong>Admin:</strong>{reservation.adminFullName}
          </p>
        </div>

        {/* Equipment Table */}
        <div className="equipment-table">
          <h3>Equipment Details</h3>
          <table>
            <thead>
              <tr>
                <th>Equipment Name</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {equipment.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="actions">
          <button onClick={() => handleCancel()} className="cancel-button">
            Cancel Reservation
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelReservation;
