import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/complaintForm.css"; // Add appropriate CSS styles for this component
import Navbar from "./Navbar";

const ComplaintForm = () => {
  const [selection, setSelection] = useState("companies"); // Default selection
  const [companies, setCompanies] = useState([]);
  const [companyAdmins, setCompanyAdmins] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedAdmin, setSelectedAdmin] = useState("");
  const [complaintText, setComplaintText] = useState("");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    fetchCompanies();
    fetchCompanyAdmins();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/companies", {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: token,
        },
      });
      const data = await response.json();
      setCompanies(data);
    } catch (error) {
      console.log("Error fetching companies:", error);
    }
  };

  const fetchCompanyAdmins = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/users/getAllCompanyAdmins", {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: token,
        },
      });
      const data = await response.json();
      setCompanyAdmins(data);
    } catch (error) {
      console.log("Error fetching company admins:", error);
    }
  };

  const handleSubmit = async (e) => {
    const sendData = {
      companyId: null,
      companyAdminId: null,
      text: complaintText,
    };
  
    // Update sendData based on selection
    if (selection === "companies") {
      sendData.companyId = selectedCompany;
      sendData.companyAdminId = null;
    } else {
      sendData.companyId = null;
      sendData.companyAdminId = selectedAdmin;
    }
    
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8080/api/complaint", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: token,
        },
        body: JSON.stringify(sendData),
      });
      if (response.ok) {
        navigate("/userComplaints");
      } else {
        console.log("Error submitting complaint");
        alert('You cant complain on compant/user that didnt give you eequipment')
      }
    } catch (error) {
      console.log("Error submitting complaint:", error);
    }
  };

  return (
    <div className="container">
      <Navbar />
      <div className="form-wrapper">
        <h2>Submit a Complaint</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Select Type:</label>
            <div className="radio-group">
              <div>
                <input
                  type="radio"
                  id="companies"
                  name="selection"
                  value="companies"
                  checked={selection === "companies"}
                  onChange={(e) => setSelection(e.target.value)}
                />
                <label htmlFor="companies">Company</label>
              </div>
              <div>
                <input
                  type="radio"
                  id="companyAdmins"
                  name="selection"
                  value="companyAdmins"
                  checked={selection === "companyAdmins"}
                  onChange={(e) => setSelection(e.target.value)}
                />
                <label htmlFor="companyAdmins">Company Admin</label>
              </div>
            </div>
          </div>
          {selection === "companies" ? (
            <div className="form-group">
              <label>Select Company:</label>
              <select
                value={selectedCompany}
                onChange={(e) => setSelectedCompany(e.target.value)}
              >
                <option value="">Select a company</option>
                {companies.map((company) => (
                  <option key={company.id} value={company.id}>
                    {company.name}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="form-group">
              <label>Select Company Admin:</label>
              <select
                value={selectedAdmin}
                onChange={(e) => setSelectedAdmin(e.target.value)}
              >
                <option value="">Select a company admin</option>
                {companyAdmins.map((admin) => (
                  <option key={admin.id} value={admin.id}>
                    {admin.firstName} {admin.lastName}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div className="form-group">
            <label>Complaint Text:</label>
            <textarea
              value={complaintText}
              onChange={(e) => setComplaintText(e.target.value)}
              required
            />
          </div>
          <button type="submit">Submit Complaint</button>
        </form>
      </div>
    </div>
  );
};

export default ComplaintForm;
