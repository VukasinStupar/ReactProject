import React, { useEffect, useState } from "react";
import "../styles/form.css";
import "../styles/userFutureReservations.css";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

const UserFutureReservations = () => {
  const { id } = useParams();
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUser();
    fetchReservations();
  }, [id]);

  const fetchUser = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/users/getLoggedUser`,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: token, // Ensured correct token format
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }

      const data = await response.json();
      setUser(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchReservations = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/reservations/futureReservations`,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch reservation data");
      }

      const data = await response.json();
      setReservations(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
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

  const handleCancelReservationClick = (reservationId) => {
    navigate(`/cancelReservation/${reservationId}`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!user) {
    return <div>No user information found.</div>;
  }

  return (
    <div className="user-info-container">
       <Navbar></Navbar>
      <h2>User Information</h2>
      <div className="user-details">
        <div className="detail-item">
          <strong>First Name:</strong> {user.firstName}
        </div>
        <div className="detail-item">
          <strong>Last Name:</strong> {user.lastName}
        </div>
        <div className="detail-item">
          <strong>Email:</strong> {user.email}
        </div>
        <div className="detail-item">
          <strong>City:</strong> {user.city}
        </div>
        <div className="detail-item">
          <strong>Country:</strong> {user.country}
        </div>
        <div className="detail-item">
          <strong>Phone Number:</strong> {user.phoneNumber}
        </div>
        <div className="detail-item">
          <strong>Profession:</strong> {user.profession}
        </div>
        <div className="detail-item">
          <strong>Company Info:</strong> {user.informationAboutCompany}
        </div>
        <div className="detail-item">
          <strong>Penalties:</strong> {user.penals}
        </div>
      </div>

      <div className="container">
        <h2>Reservation Information</h2>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Date and Time</th>
                <th>Duration</th>
                <th>Company Name</th>
                <th>Status</th>
                <th>Cancel</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((reservation) => (
                <tr key={reservation.id}>
                  <td>{formatDate(reservation.dateAndTime)}</td>
                  <td>{reservation.duration}</td>
                  <td>{reservation.companyName}</td>
                  <td>{reservation.status}</td>
                  <td>
                    <button
                      onClick={() =>
                        handleCancelReservationClick(reservation.id)
                      }
                    >
                      Cancel Reservation
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserFutureReservations;
