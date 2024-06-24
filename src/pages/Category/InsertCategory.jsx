import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  allMessage,
  validationCategory,
} from "../../component/Helper/LogicServer";
import { ToastContainer } from "react-toastify";

export default function InsertCategory({ onOpen, onClose, title }) {
  axios.defaults.withCredentials = true;
  if (!onOpen) return null;
  const { toastMessage, message } = allMessage();
  const [values, setValues] = useState({
    name: "",
  });

  const getToken = localStorage.getItem("token");
  const token = JSON.parse(getToken);

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    validationCategory
      .validate(values, { abortEarly: false })
      .then(() => {
        axios
          .post(
            "https://project-ii-server.vercel.app/insert-category",
            values,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .then((res) => {
            toastMessage("success", res.data.message);
            console.log(res.data);
            console.log(values);
          })
          .catch((err) => {
            console.log(err);
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
      <div className={`overlay-modal`} onClick={onClose}>
        <div
          className={`modal-area`}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <h1>{title}</h1>
          <span onClick={onClose} className="material-symbols-outlined">
            close
          </span>
          <form className="form-modal-area" onSubmit={handleSubmit}>
            <div className="form-modal-area-row">
              <label htmlFor="name" className="form-label">
                Category Name
              </label>
              <input
                onChange={handleChange}
                type="text"
                id="name"
                name="name"
                className="form-input"
                value={values.name}
              />
            </div>
            <button type="submit" className="form-submit">
              Add Category
            </button>
          </form>
        </div>
      </div>
      {message && <ToastContainer />}
    </>
  );
}
