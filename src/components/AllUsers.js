import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/allUsers.css"; 
import Navbar from "./Navbar";


const AllUsers = () => {
    const [users, setUsers] = useState([]);
    const token = localStorage.getItem("token");

    const navigate = useNavigate();
  

    useEffect(() => {
 
        fetchUsers();
    }, []);
    
    const fetchUsers = async () => {
        try {
          const response = await fetch("http://localhost:8080/api/users", {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: token
            },
          });
          const data = await response.json();
          setUsers(data);

        } catch (error) {
          console.log("Error fetching users:", error);
        }
    };

    const handleUserClick = (userId) => {
        navigate(`/userFutureReservations/${userId}`);
      };
      


    return (
        <div className="container">
        <Navbar></Navbar>
        <div className="table-wrapper">
            <table>
                <thead>
                    <tr>
                        <th>username</th>
                        <th>firstName</th>
                        <th>lastName</th>
                        <th>email</th>
                        <th>city</th>
                        <th>country</th>
                        <th>phoneNumber</th>
                        <th>profession</th>
                        <th>informationAboutCompany</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td>{user.username}</td>
                            <td>{user.firstName}</td>
                            <td>{user.lastName}</td>
                            <td>{user.email}</td>
                            <td>{user.city}</td>
                            <td>{user.country}</td>
                            <td>{user.phoneNumber}</td>
                            <td>{user.profession}</td>
                            <td>{user.informationAboutCompany}</td>

                            <td><button onClick={() => handleUserClick(user.id)}>
                            userFutureReservations
                            </button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
    );
}

export default AllUsers;