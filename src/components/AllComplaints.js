import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/allComplaints.css";
import Navbar from "./Navbar";

const AllComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const token = localStorage.getItem("token");

  const navigate = useNavigate();

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/complaint", {
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

  const handleResponseToComplaintClick = (complaintId) => {
    navigate(`/respondeToComplaint/${complaintId}`);
  };

  return (
    <div className="container">
      <Navbar />
      <div className="table-wrapper">
        <h2>Complaints</h2>
        <table>
          <thead>
            <tr>
              <th>Guest</th>
              <th>Company</th>
              <th>Company Admin</th>
              <th>Text</th>
              <th>Response</th>
              <th>Action</th> {/* Renamed for clarity */}
            </tr>
          </thead>
          <tbody>
            {complaints.map((complaint) => (
              <tr key={complaint.id}>
                <td>{complaint.guestFullName}</td>
                <td>{complaint.companyName}</td>
                <td>{complaint.companyAdminFullName}</td>
                <td>{complaint.text}</td>
                <td>{complaint.response || "No response yet"}</td>
                <td>
                  {!complaint.response ? ( // Check if the complaint has a response
                    <button
                      onClick={() =>
                        handleResponseToComplaintClick(complaint.id)
                      }
                    >
                      Respond to Complaint
                    </button>
                  ) : (
                    <button disabled>Responded</button> // Disabled button
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllComplaints;
