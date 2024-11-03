import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/allEquipments.css";
import Navbar from "./Navbar";

const AllEquipments = () => {
    const [equipments, setEquipments] = useState([]);
    const [errorMessage, setErrorMessage] = useState(""); // Define errorMessage state
    const token = localStorage.getItem("token");
    const [searchName, setSearchName] = useState("");
    const [searchDescription, setSearchDescription] = useState("");

    useEffect(() => {
        fetchEquipments();
    }, []);

    const fetchEquipments = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/equipments", {
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: token
                },
            });
            if (!response.ok) throw new Error("Failed to fetch equipments.");
            const data = await response.json();
            setEquipments(data);
        } catch (error) {
            console.log("Error fetching equipments:", error);
            setErrorMessage("Error fetching equipments. Please try again.");
        }
    };

    const fetchEquipmentsSearch = async (equipmentDto) => {
        console.log("Searching with parameters:", equipmentDto); // Debugging log
        try {
            const response = await fetch('http://localhost:8080/api/equipments/filter', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: token,
                },
                body: JSON.stringify(equipmentDto),
            });

            if (!response.ok) {
                const errorText = await response.text(); // Capture the response text for debugging
                throw new Error(`Error: ${response.status} ${errorText}`);
            }

            const data = await response.json();
            setEquipments(data);
            if (data.length === 0) {
                setErrorMessage("No equipments found matching the criteria.");
            } else {
                setErrorMessage(""); // Clear error message if equipments found
            }
        } catch (error) {
            console.error("Error fetching searched equipments:", error);
            setErrorMessage("Error fetching searched equipments. Please try again.");
        }
    };

    const handleEquipmentsSearch = () => {
        const equipmentDto = {
            name: searchName || undefined,
            description: searchDescription || undefined,
        };
        fetchEquipmentsSearch(equipmentDto);
    };

    return (
        <div className="container">
            <Navbar />
            <div className="table-wrapper">
                <input
                    type="text"
                    placeholder="Search by Name"
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Search by Description"
                    value={searchDescription}
                    onChange={(e) => setSearchDescription(e.target.value)}
                />
                
                <button onClick={handleEquipmentsSearch}>Search Equipments</button>

                {errorMessage && <p className="error-message">{errorMessage}</p>} {/* Error message display */}

                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Company ID</th>
                        </tr>
                    </thead>
                    <tbody>
                        {equipments.map((equipment) => (
                            <tr key={equipment.id}>
                                <td>{equipment.name}</td>
                                <td>{equipment.description}</td>
                                <td>{equipment.companyName}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AllEquipments;
