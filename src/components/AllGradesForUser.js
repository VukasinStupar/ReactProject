import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/allGradesForUser.css"; // Ensure you have appropriate styles
import Navbar from "./Navbar";

const AllGradesForUser = () => {
  const [grades, setGrades] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    fetchGradesForUser();
  }, []);

  const fetchGradesForUser = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/grades/allGradesForUser', {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: token,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch grades.');
      }

      const data = await response.json();
      setGrades(data);
    } catch (error) {
      console.error("Error fetching grades:", error);
      setErrorMessage(error.message || "Error fetching grades. Please try again.");
    }
  };

  const handleGradeClick = (gradeId) => {
    navigate(`/gradeDetail/${gradeId}`); // Adjust path as needed
  };

  return (
    <div className="container1">
      <Navbar></Navbar>
      <div className="table-wrapper1">
        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <table>
          <thead>
            <tr>
              <th>Grade Value</th>
              <th>Reason</th>
              <th>Company name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {grades.length > 0 ? (
              grades.map((grade) => (
                <tr key={grade.id}>
                  <td>{grade.gradeValue}</td>
                  <td>{grade.reason}</td>
                  <td>{grade.companyDto.name}</td>
                  
                  <td>
                    <button onClick={() => handleGradeClick(grade.id)}>View Details</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No grades available.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllGradesForUser;
