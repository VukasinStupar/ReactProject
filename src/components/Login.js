import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/logIn.css";


const Login = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    username: "",
    password: ""
  });

  const handleChange = (event) => {
    setUser({
      ...user,
      [event.target.name]: event.target.value,
    });
  };

  const onLoginClickHandler = async (event) => {
    event.preventDefault();

    const response = await fetch("http://localhost:8080/auth/login", {
      method: "POST", 
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
       
      },
      body: JSON.stringify(user),
    });
    if(response.status === 400){
        return window.alert("Wrong username or password!")
    }
    if(response.status === 401){
      return window.alert("Cant login!")
    }
    const data = await response.json();

    const token = `Bearer ${data.accessToken}`;
    localStorage.setItem("token", token);
    navigate('companies')
    try {
      const response = await fetch("http://localhost:8080/api/whoami", {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: token,
        },
      });
      const data = await response.json();
      localStorage.setItem("loggedRole", data.role);
      if(data.role === "ROLE_SYSTEM_ADMIN"){
        navigate('complaintsToRespond');
        return;
      }
      navigate('companies')
    } catch (error) {
      console.log("Error fetching comapnies:", error);
    }
    
  };

  const onRegistrateClickHandler = (event) => {
    return navigate("/registration");
  };


  return (
    <div className="login-form-container" >
      <div className="login-form-wrapper" >
        <form className="login-form" onSubmit={onLoginClickHandler}>
          <div className="input-group">
            <label htmlFor="username">Email</label>
            <input
              onChange={handleChange}
              name="username"
              type="text"
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password" className="item">
              Password
            </label>
            <input
              onChange={handleChange}
              name="password"
              type="password"
              required
            />
          </div>
          <div className="button-group">
            <button className="item" type="submit">
              Login
            </button>
            <button type="button" onClick={onRegistrateClickHandler}>
              Dont have account?
            </button>
          
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
