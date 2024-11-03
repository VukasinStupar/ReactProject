import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/respondeToComplaint.css"; // Create this CSS file for styling
import Navbar from "./Navbar";

const RespondeToComplaint = () => {
  const { id } = useParams(); 
  const token = localStorage.getItem("token"); 
  const [complaint, setComplaint] = useState(null); 
  const [error, setError] = useState(null); 
  const [responseText, setResponseText] = useState("");
  const navigate = useNavigate(); 

  useEffect(() => {
    fetchComplaint();
  }, [id]); // Fetch complaint whenever the ID changes

  const fetchComplaint = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/complaint/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: token, 
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setComplaint(data); // Set the complaint data
    } catch (error) {
      console.error("Error fetching complaint:", error);
      setError("Failed to fetch complaint. Please try again later.");
    }
  };

  const handleResponse = async () => {
    const sendData = { 
      id : id,
      response: responseText 
    };
    try {
      const response = await fetch(`http://localhost:8080/api/complaint/respondeComplaint/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: token,
        },
        body: JSON.stringify(sendData), // Send the response text
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log("Response submitted:", data);
      navigate("/complaints"); // Redirect after successful response
    } catch (error) {
      console.error("Error responding to complaint:", error);
      setError("Failed to respond to complaint. Please try again later.");
    }
  };

  if (error) {
    return <div className="error-message">{error}</div>; // Display error message if there was an error
  }

  if (!complaint) {
    return <div className="loading-message">Loading...</div>; // Display a loading message while fetching
  }

  return (
    <div className="container">
      <Navbar />
      <div className="complaint-details-wrapper">
        <h2>Complaint Details</h2>
        <div className="complaint-details">
          <p><strong>Guest:</strong> {complaint.guestFullName}</p>
          <p><strong>Company:</strong> {complaint.companyName}</p>
          <p><strong>Company Admin:</strong> {complaint.companyAdminFullName}</p>
          <p><strong>Complaint Text:</strong> {complaint.text}</p>
          <p><strong>Response:</strong> {complaint.response || "No response yet"}</p>
        </div>

        <div className="response-section">
          <h3>Respond to Complaint</h3>
          <textarea
            value={responseText}
            onChange={(e) => setResponseText(e.target.value)}
            placeholder="Enter your response here"
          />
          <button onClick={handleResponse} className="response-button">
            Submit Response
          </button>
        </div>
      </div>
    </div>
  );
};

export default RespondeToComplaint;
