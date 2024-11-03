import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/form.css";
import Navbar from "./Navbar";


const CreateAppointment = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [appointment, setAppointment] = useState({
    dateAndTime: "",
    duration: "",
  });

  const onCreateClickHandler = async (event) => {
    event.preventDefault();

    fetch("http://localhost:8080/api/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json",
      Authorization: token },
      body: JSON.stringify(appointment),
    })
      .then((response) => {
        if (response.status === 400) {
          return window.alert("Creation failed!");
        }
        if (response.status === 200) {
          window.alert("Creation successful.");
          return navigate("/companies");
        } else if (response.status === 201) {
          window.alert("Creation successful.");
          return navigate("/companies");
        } else {
          return window.alert("Creation failed!");
        }
      })
      .catch((error) => {
        console.error(error);
        window.alert("An error occurred during registration.");
      });
  };

  const onCancelClickHandler = () => {
    return navigate("/");
  };

  const handleChange = (event) => {
    setAppointment({
      ...appointment,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <div className="registration-form-container">
    <Navbar></Navbar>
      <div className="registration-form-wrapper">
        <form className="registration-form" onSubmit={onCreateClickHandler}>
          <div className="input-group">
            <label htmlFor="dateAndTime" className="item">
              Date and Time
            </label>
            <input
              onChange={handleChange}
              name="dateAndTime"
              type="datetime-local"
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="duration" className="item">
              Duration (minutes)
            </label>
            <input
              onChange={handleChange}
              name="duration"
              type="number"
              required
            />
          </div>

          <div className="button-group">
            <button className="item" type="submit">
              Register
            </button>
            <button type="button" onClick={onCancelClickHandler}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAppointment;
