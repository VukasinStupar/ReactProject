import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/userComplaints.css";
import Navbar from "./Navbar";

const UserComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const token = localStorage.getItem("token");

  const navigate = useNavigate();

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/complaint/userComplaintHistory", {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: token,
        },
      });
      const data = await response.json();
      setComplaints(data);
    } catch (error) {
      console.log("Error fetching complaints:", error);
    }
  };

 

  return (
    <div className="container">
      <Navbar></Navbar>
      <div className="table-wrapper">
        <h2>ComplaintsHistory</h2>
        <table>
          <thead>
            <tr>
          
              <th>Company</th>
              <th>Company Admin</th>
              <th>Text</th>
              <th>Response</th>
              
            </tr>
          </thead>
          <tbody>
            {complaints.map((complaint) => (
              <tr key={complaint.id}>
                
                <td>{complaint.companyName}</td>
                <td>{complaint.companyAdminFullName}</td>
                <td>{complaint.text}</td>
                <td>{complaint.response || "No response yet"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserComplaints;
