import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/allReservations.css";
import Navbar from "./Navbar";


const AllReservations = () => {
    const [reservations, setReservations] = useState([]);
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    const fetchReservations = useCallback(async () => {
        try {
            const response = await fetch("http://localhost:8080/api/reservations", {
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: `${token}` // Ensure the token is prefixed correctly
                },
            });
            if (!response.ok) {
                throw new Error("Failed to fetch reservations");
            }
            const data = await response.json();
            console.log("Fetched reservations:", data); // Debug log
            setReservations(data);
        } catch (error) {
            console.error("Error fetching reservations:", error);
        }
    }, [token]);

    useEffect(() => {
        fetchReservations();
    }, [fetchReservations]);

    

    return (
        <div className="container">
            <Navbar></Navbar>
            <div className="table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reservations.length > 0 ? (
                            reservations.map((reservation) => (
                                <tr key={reservation.id}>
                                    <td>{reservation.user}</td>
                                    <td>{reservation.status}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3">No reservations available</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AllReservations;
