import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  allMessage,
  validationCategory,
} from "../../component/Helper/LogicServer";
import { ToastContainer } from "react-toastify";

export default function UpdateCategory({ onOpen, onClose, categoryId, title }) {
  axios.defaults.withCredentials = true;
  if (!onOpen) return null;
  const { toastMessage, message } = allMessage();
  const [getCategory, setGetCategory] = useState({});

  const getToken = localStorage.getItem("token");
  const token = JSON.parse(getToken);

  useEffect(() => {
    axios
      .get(`https://project-ii-server.vercel.app/get-category/${categoryId}`)
      .then((res) => {
        setGetCategory(res.data[0]);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [categoryId]);

  const handleChange = (e) => {
    setGetCategory({ ...getCategory, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    validationCategory
      .validate(getCategory, { abortEarly: false })
      .then(() => {
        axios
          .put(
            `https://project-ii-server.vercel.app/update-category/${categoryId}`,
            getCategory,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .then((res) => {
            toastMessage("success", res.data.message);
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
                value={getCategory?.name || ""}
              />
            </div>
            <button type="submit" className="form-submit">
              Update Category
            </button>
          </form>
        </div>
      </div>
      {message && <ToastContainer />}
    </>
  );
}
