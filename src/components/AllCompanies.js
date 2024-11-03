import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/allCompanies.css";
import Navbar from "./Navbar";

const AllCompanies = () => {
  const [companies, setCompanies] = useState([]);
  const [role, setRole] = useState("");
  const [searchName, setSearchName] = useState("");
  const [searchAdress, setSearchAdress] = useState("");
  const [searchGradeFrom, setSearchGradeFrom] = useState("");
  const [searchGradeTo, setSearchGradeTo] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [userId, setUserId] = useState(null);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    fetchLoggedUser();
    fetchCompanies();
  }, []);

  const fetchLoggedUser = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/users/getLoggedUser', {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: token,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch user data.');
      const data = await response.json();
      setRole(data.role);
      setUserId(data.id); // Store user ID
    } catch (error) {
      console.error("Error fetching logged user:", error);
    }
  };

  const fetchCompanies = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/companies', {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: token,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch companies.');
      const data = await response.json();
      setCompanies(data);
    } catch (error) {
      console.error("Error fetching companies:", error);
      setErrorMessage("Error fetching companies. Please try again.");
    }
  };

  const fetchCompaniesSearch = async (searchDto) => {
    try {
      const response = await fetch('http://localhost:8080/api/companies/filter', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: token,
        },
        body: JSON.stringify(searchDto),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      setCompanies(data);
      setErrorMessage(data.length === 0 ? "No companies found matching the criteria." : "");
    } catch (error) {
      console.error("Error fetching searched companies:", error);
      setErrorMessage("Error fetching searched companies. Please try again.");
    }
  };

  const fetchCheckReservations = async (companyId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/reservations/reservationScheduledCompanyIdUserId/${companyId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: token,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch reservations.');
      const data = await response.json();
      return data; // Return the reservation check result
    } catch (error) {
      console.error("Error fetching reservations:", error);
      setErrorMessage("Error fetching reservations. Please try again.");
      return false; // Default to false on error
    }
  };

  const handleCompanyClick = (companyId) => {
    const path = role === "ROLE_USER" ? `/companyPageUser/${companyId}` : `/companyPageAdmin/${companyId}`;
    navigate(path);
  };

 

  

  const handleSearch = () => {
    const searchDto = {
      name: searchName || undefined,
      adress: searchAdress || undefined,
      gradeFrom: searchGradeFrom ? parseFloat(searchGradeFrom) : undefined,
      gradeTo: searchGradeTo ? parseFloat(searchGradeTo) : undefined,
    };
    fetchCompaniesSearch(searchDto);
  };

  return (
    <div className="container1">
      <Navbar />
      <div className="table-wrapper1">
        <input
          type="text"
          placeholder="Search by Name"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Search by Address"
          value={searchAdress}
          onChange={(e) => setSearchAdress(e.target.value)}
        />
        <input
          type="number"
          placeholder="Grade From"
          value={searchGradeFrom}
          onChange={(e) => setSearchGradeFrom(e.target.value)}
          min={0}
        />
        <input
          type="number"
          placeholder="Grade To"
          value={searchGradeTo}
          onChange={(e) => setSearchGradeTo(e.target.value)}
          max={10}
        />
        
        <button onClick={handleSearch}>Search</button>

        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Adress</th>
              <th>Description</th>
              <th>Average Grade</th>
              <th>Actions</th>
              
            </tr>
          </thead>
          <tbody>
            {companies.map((company) => (
              <tr key={company.id}>
                <td>{company.name}</td>
                <td>{company.adress}</td> {/* Fixed address typo */}
                <td>{company.description}</td>
                <td>{company.averageGrade}</td>
                <td>
                  <button onClick={() => handleCompanyClick(company.id)}>View</button>
                </td>

             
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllCompanies;
