import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import "../styles/navbar.css";

const Navbar = () => {
  const token = localStorage.getItem("token");
  const [role, setRole] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchLoggedUser();
  }, []);

  const fetchLoggedUser = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/users/getLoggedUser",
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: token,
          },
        }
      );
      const data = await response.json();
      setRole(data.role);
    } catch (error) {
      console.log("Error fetching complaints:", error);
    }
  };

  const logoutClickHandler = () => {
    localStorage.clear();
    navigate("/");
  };
  return (
    <nav className="navbar">
      <ul>
        {role === "ROLE_USER" ? (
          <ul>
            <li>
              <Link to="/companies">All companies</Link>
            </li>
            <li>
              <Link to="/userFutureReservations">User Future Reservations</Link>
            </li>
            <li>
              <Link to="/complaintForm">Complaint Form</Link>
            </li>
            <li>
              <Link to="/userComplaints">Your Complaint History</Link>
            </li>
            <li>
              <Link to="/allGradesForUser">All Grades For User</Link>
            </li>
          </ul>
        ) : role === "ROLE_SYSTEM_ADMIN" ? (
          <ul>
            <li>
              <Link to="/adminDashboard">Admin Dashboard</Link>
            </li>
          </ul>
        ) : role === "ROLE_COMPANY_ADMIN" ? (
          <ul>
            <li>
              <Link to="/companies">All companies</Link>
            </li>
            <li>
              <Link to="/createEquipments">Create equipment</Link>
            </li>
            <li>
              <Link to="/equipmentCharts">Equipment charts</Link>
            </li>
            <li>
              <Link to="/monthIncome">Month income</Link>
            </li>
            <li>
              <Link to="/reservationCountForYear">ReservationCountForYear</Link>
            </li>
            <li>
              <Link to="/productsIncome">Products incomes</Link>
            </li>
          </ul>
        ) : (
          <ul></ul>
        )}
        <ul>
          <li>
            <button onClick={logoutClickHandler}>Log out</button>
          </li>
        </ul>
      </ul>
    </nav>
  );
};

export default Navbar;
