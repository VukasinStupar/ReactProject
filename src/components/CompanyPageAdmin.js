import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/companyPageAdmin.css";
import Navbar from "./Navbar";

const CompanyPageAdmin = () => {
  const { id } = useParams();
  const token = localStorage.getItem("token");

  const [equipment, setEquipment] = useState({
    name: "",
    description: "",
    companyId: "",
  });

  const [appointment, setAppointment] = useState({
    dateAndTime: "",
    duration: "",
    administratorId: "",
    companyId: id,
    status: "",
  });

  const [reservation, setReservation] = useState({
    appointmentId: "",
    userId: "",
    status: "",
    
    
  });

  const [company, setCompany] = useState(null);
  const [equipments, setEquipments] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCompany();
    fetchEquipment();
    fetchAppointment();
    fetchReservation();
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

  const fetchEquipment = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/equipments/byCompanyId/${id}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch equipment data");
      }

      const data = await response.json();
      setEquipments(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAppointment = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/appointments/byCompanyId/${id}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch appointment data");
      }

      const data = await response.json();
      setAppointments(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchReservation = async () => {
    
    try {
      const response = await fetch(
        `http://localhost:8080/api/reservations/reservationsByAppointmentCompanyId/${id}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch reservation data");
      }

      const data = await response.json();
      setReservations(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateArray) => {
    const [year, month, day, hour, minute] = dateArray;
    const date = new Date(year, month - 1, day, hour, minute);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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

  const onCreateClickHandler = async (event) => {
    event.preventDefault();

    const sendData = {
      name: equipment.name,
      description: equipment.description,
      companyId: id,
    };

    fetch("http://localhost:8080/api/equipments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(sendData),
    })
      .then((response) => {
        if (response.status === 400) {
          return window.alert("Creation failed!");
        }
        if (response.status === 200 || response.status === 201) {
          window.alert("Creation successful.");
          fetchEquipment();
        } else {
          return window.alert("Creation failed!");
        }
      })
      .catch((error) => {
        console.error(error);
        window.alert("An error occurred during registration.");
      });
  };
  
  const handleChange = (event) => {
    setEquipment({
      ...equipment,
      [event.target.name]: event.target.value,
    });
  };

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

      <div className="container">
        <h3>Equipments</h3>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {equipments.map((equipment) => (
                <tr key={equipment.id}>
                  <td>{equipment.name}</td>
                  <td>{equipment.description}</td>
                  <td>{equipment.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="container">
        <h3>Appointments</h3>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Date and Time</th>
                <th>Duration</th>
                <th>Admin Name</th>
              </tr>
            </thead>
            <tbody>
              
              {appointments.map((appointment) => (
                <tr key={appointment.id}>
                  <td>{formatDate(appointment.dateAndTime)}</td>
                  <td>{appointment.duration} minutes</td>
                  <td>{appointment.adminName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>


      <div className="container">
        <h3>Reservations</h3>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>appointmentId</th>
                <th>userId</th>
                <th>status</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((reservation) => (
                <tr key={reservation.id}>
                  <td>{reservation.appointmentId}</td>
                  <td>{reservation.userId}</td>
                  <td>{reservation.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default CompanyPageAdmin;












