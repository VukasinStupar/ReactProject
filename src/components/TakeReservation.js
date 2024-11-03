import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/takeReservation.css";
import Navbar from "./Navbar";

const TakeReservation = () => {
  const { id } = useParams(); // Get the reservation ID from the URL parameters
  const token = localStorage.getItem("token"); // Retrieve the token from local storage
  const [reservation, setReservation] = useState(null); // State for storing a single reservation
  const [error, setError] = useState(null); // State for error handling

  useEffect(() => {
    fetchReservation();
  }, [id]); // Fetch reservation whenever the ID changes

  const fetchReservation = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/reservations/byReservationId/${id}`,
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

  const handleTake = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/reservations/takeReservation/${reservation.id}`,
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
      console.error("Error taking reservation:", error);
      setError("Failed to take reservation. Please try again later.");
    }
  };

  if (error) {
    return <div className="error-message">{error}</div>; // Display error message if there was an error
  }

  if (!reservation) {
    return <div className="loading-message">Loading...</div>; // Display a loading message while fetching
  }

  return (
    <div className="container">
      <Navbar />
      <div className="details-wrapper">
        <h2>Reservation Details</h2>
        <div className="reservation-details">
          <p>
            <strong>User:</strong> {reservation.user}
          </p>
          <p>
            <strong>Status:</strong> {reservation.status}
          </p>
          <p>
            <strong>Date and Time:</strong> {formatDate(reservation.dateAndTime)}
          </p>
          <p>
            <strong>Duration:</strong> {reservation.duration}
          </p>
          <p>
            <strong>Company Name:</strong> {reservation.companyName}
          </p>
          <p>
            <strong>Admin:</strong> {reservation.adminFullName}
          </p>
        </div>
        <div className="actions">
          {reservation.status === "SCHEDULED" && (
            <button onClick={handleTake} className="take-button">
              Take Reservation
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TakeReservation;
