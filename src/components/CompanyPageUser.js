import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/companyPageUser.css";
import Navbar from "./Navbar";


const CompanyPageUser = () => {
  const { id } = useParams();
  const token = localStorage.getItem("token");
  const navigate = useNavigate(); 

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

  const [company, setCompany] = useState(null);
  const [equipments, setEquipments] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [selectedEquipmentIds, setSelectedEquipmentIds] = useState([]); // State for selected equipment
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null); // State for selected appointment
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCompany();
    fetchEquipment();
    fetchAppointment();
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

  const onReservationSubmit = async (event) => {
    event.preventDefault();

    if (!selectedAppointmentId) {
      window.alert("Please select an appointment.");
      return;
    }

    if (selectedEquipmentIds.length === 0) {
      window.alert("Please select at least one equipment.");
      return;
    }

    const reservationData = {
      equipmentIds: selectedEquipmentIds,
      appointmentId: selectedAppointmentId,
    };

    try {
      const response = await fetch("http://localhost:8080/api/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(reservationData),
      });

      if (response.ok) {
        window.alert("Reservation successful.");
      } else {
        window.alert("Failed to create reservation.");
      }
    } catch (error) {
      console.error(error);
      window.alert("An error occurred during reservation.");
    }
  };

  const handleEquipmentChange = (event) => {
    const equipmentId = event.target.value;
    setSelectedEquipmentIds((prev) =>
      event.target.checked
        ? [...prev, equipmentId]
        : prev.filter((id) => id !== equipmentId)
    );
  };

  const handleAppointmentChange = (event) => {
    setSelectedAppointmentId(event.target.value);
  };
  const navigateToGradeCompany = () => {
    navigate(`/gradeCompany/${id}`);
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
        <div className="table-wrapper">
          <form onSubmit={onReservationSubmit}>
            <table>
              <thead>
                <tr>
                  <th>Select</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {equipments.map((equipment) => (
                  <tr key={equipment.id}>
                    <td>
                      <input
                        type="checkbox"
                        value={equipment.id}
                        onChange={handleEquipmentChange}
                      />
                    </td>
                    <td>{equipment.name}</td>
                    <td>{equipment.description}</td>
                    <td>{equipment.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h3>Select an Appointment</h3>
            <div className="appointments-list">
              {appointments.map((appointment) => (
                <div key={appointment.id}>
                  <input
                    type="radio"
                    value={appointment.id}
                    name="appointment"
                    onChange={handleAppointmentChange}
                  />
                  <label>
                    {formatDate(appointment.dateAndTime)} -{" "}
                    {appointment.duration} minutes
                  </label>
                </div>
              ))}
            </div>

            <button type="submit">Make Reservation</button>
          </form>

        </div>
        <button onClick={navigateToGradeCompany}>
          Go to Grade Company
        </button>
      </div>
    </div>
  );
};

export default CompanyPageUser;
