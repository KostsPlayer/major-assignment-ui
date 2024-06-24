import React, { useState } from "react";
import Cursor from "../../component/Helper/Cursor";
import { Link } from "react-router-dom";
import image from "../../assets/image/2.jpg";
import { ToastContainer } from "react-toastify";
import {
  validationSignUp,
  allMessage,
} from "../../component/Helper/LogicServer";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Registration() {
  axios.defaults.withCredentials = true;

  const { toastMessage, message } = allMessage();
  const redirect = useNavigate();
  const goBack = () => {
    // window.history.back();
    redirect("/major-assignment-ui");
  };

  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    repeatPassword: "",
  });

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    validationSignUp
      .validate(values, { abortEarly: false })
      .then(() => {
        axios
          .post("https://project-ii-server.vercel.app/registration", values)
          .then((res) => {
            localStorage.setItem(
              "registrationMessage",
              "Registration Successfully!"
            );
            const userId = res.data.userId;
            redirect(`/roles/${userId}`);
          })
          .catch((err) => {
            toastMessage("error", err);
          });
      })
      .catch((errors) => {
        const errorMessages = errors.inner.map((error) => (
          <li key={error.path}>{error.message}</li>
        ));
        toastMessage(
          "error",
          <ul className="error-message">{errorMessages}</ul>,
          "top-center"
        );
      });
  };

  return (
    <>
      <Cursor />
      <div className="registration">
        <div className="registration-image">
          <img className="image" src={image} alt="image" />
        </div>
        <div className="registration-container">
          <div className="registration-container-box">
            <div className="registration-top">
              <span className="material-symbols-outlined back" onClick={goBack}>
                keyboard_backspace
              </span>
              <div className="registration-title">Sign Up</div>
            </div>
            <form className="registration-form" onSubmit={handleSubmit}>
              <div className="registration-form-row">
                <input
                  type="text"
                  name="username"
                  id="username"
                  placeholder="Username"
                  autoComplete="off"
                  onChange={handleChange}
                />
                <label htmlFor="username">Username</label>
              </div>
              <div className="registration-form-row">
                <input
                  type="text"
                  name="email"
                  id="email"
                  placeholder="Email"
                  autoComplete="off"
                  onChange={handleChange}
                />
                <label htmlFor="email">Email</label>
              </div>
              <div className="registration-form-row">
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Password"
                  onChange={handleChange}
                />
                <label htmlFor="password">Password</label>
              </div>
              <div className="registration-form-row">
                <input
                  type="password"
                  name="repeatPassword"
                  id="repeat-password"
                  placeholder="Repeat Password"
                  onChange={handleChange}
                />
                <label htmlFor="repeat-password">Repeat Password</label>
              </div>
              <button type="submit">sign up</button>
              <span className="have-account">
                Already have an account?
                <Link className="to-login" to="/login">
                  Login
                </Link>
              </span>
            </form>
          </div>
        </div>
      </div>
      {message && <ToastContainer />}
    </>
  );
}
