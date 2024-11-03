import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/companyInfo.css";
import Navbar from "./Navbar";

const GradeCompany = () => {
  const { id } = useParams();
  const token = localStorage.getItem("token");

  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [grade, setGrade] = useState("");
  const [reason, setReason] = useState("");
  const [customReason, setCustomReason] = useState("");

  const reasonsOptions = [
    "Excellent Service",
    "Good Quality",
    "Average Experience",
    "Poor Communication",
    "Other",
  ];

  useEffect(() => {
    fetchCompany();
  }, [id]);

  const fetchCompany = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/companies/${id}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch company data");
      }

      const data = await response.json();
      setCompany(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitGrade = async (event) => {
    event.preventDefault();

    const selectedReason = reason === "Other" ? customReason : reason;


    const requestBody = {
      companyId: id,
      gradeValue: grade,
      reason: selectedReason,
    };

    try {
      const response = await fetch('http://localhost:8080/api/grades', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: token,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) throw new Error('Failed to submit grade.');

      const data = await response.json();
      console.log("Grade submitted successfully:", data);
      // Optionally reset the form
      setGrade("");
      setReason("");
      setCustomReason("");
      alert("Successful grading");
     
    } catch (error) {
      console.error("Error submitting grade:", error);
      alert("Grading failed");
      
    }
  };

  if (loading) {
    return <div>Loading company information...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!company) {
    return <div>No company information found.</div>;
  }

  return (
    <div className="company-info-container">
      <Navbar></Navbar>
      <h2>Company Information</h2>
      <div className="company-details">
        <div className="detail-item">
          <strong>Name:</strong> {company.name}
        </div>
        <div className="detail-item">
          <strong>Address:</strong> {company.adress}
        </div>
        <div className="detail-item">
          <strong>Description:</strong> {company.description}
        </div>
      </div>

      <div>
        <h3>Submit Your Grade</h3>
        <form onSubmit={handleSubmitGrade}>
          <div>
            <label>
              Grade:
              <input
                type="number"
                min="1"
                max="5"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                required
              />
            </label>
          </div>

          <div>
            <label>
              Reason for Grade:
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
              >
                <option value="">Select a reason</option>
                {reasonsOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {reason === "Other" && (
            <div>
              <label>
                Please specify:
                <input
                  type="text"
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  required
                />
              </label>
            </div>
          )}

          <button type="submit">Submit Grade</button>
        </form>
      </div>
    </div>
  );
};

export default GradeCompany;
