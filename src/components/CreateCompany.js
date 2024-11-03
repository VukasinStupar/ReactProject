import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/form.css";
import Navbar from "./Navbar";


const CreateCompany = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [company, setCompany] = useState({
    name: "",
    adress: "",
    description: "",
  });

  const onCreateClickHandler = async (event) => {
    event.preventDefault();

    fetch("http://localhost:8080/api/companies", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: token },
      body: JSON.stringify(company),
    })
      .then((response) => {
        if (response.status === 400) {
          return window.alert("Creation failed!");
        }

        window.alert("Creation succesfull.");
        return navigate("/");
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
    setCompany({
      ...company,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <div class="registration-form-container">
      <Navbar></Navbar>
      <div class="registration-form-wrapper">
        <form className="registration-form" onSubmit={onCreateClickHandler}>
          <div className="input-group">
            <label htmlFor="name" className="item">
              Name
            </label>
            <input onChange={handleChange} name="name" type="text" required />
          </div>
          <div className="input-group">
            <label htmlFor="adress" className="item">
              Adress
            </label>
            <input onChange={handleChange} name="adress" type="text" required />
          </div>
          <div className="input-group">
            <label htmlFor="description" className="item">
              Description
            </label>
            <input
              onChange={handleChange}
              name="description"
              type="text"
              required
            />
          </div>

          <div class="button-group">
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

export default CreateCompany;