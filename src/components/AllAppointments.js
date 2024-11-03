import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/allAppointments.css";
import Navbar from "./Navbar";

const AllAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const token = localStorage.getItem("token");

    const navigate = useNavigate();


    useEffect(() => {
 
        fetchAppointments();
    }, []);
    
    const fetchAppointments = async () => {
        try {
          const response = await fetch("http://localhost:8080/api/appointments", {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: token
            },
          });
          const data = await response.json();
          setAppointments(data);
        } catch (error) {
          console.log("Error fetching appointments:", error);
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

    
    return (
        <div className="container">
          <Navbar></Navbar>
        <div className="table-wrapper">
            <table>
                <thead>
                    <tr>
                        <th>dateAndTime</th>
                        <th>duration</th>
                        <th>status</th>
                        <th>companyId</th>
                        <th>administratorId</th>
                    </tr>
                </thead>
                <tbody>
                    {appointments.map((appointment) => (
                        <tr key={appointment.id}>
                            <td>{formatDate(appointment.dateAndTime)}  -{" "}</td>
                            <td>{appointment.duration}</td>
                            <td>{appointment.status}</td>
                            <td>{appointment.companyId}</td>
                            <td>{appointment.administratorId}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
    );
}

export default AllAppointments;