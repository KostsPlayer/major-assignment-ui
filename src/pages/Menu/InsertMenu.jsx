import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { validationMenu, allMessage } from "../../component/Helper/LogicServer";
import { ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function InsertMenu({ onOpen, onClose, title }) {
  axios.defaults.withCredentials = true;
  if (!onOpen) return null;

  const navigate = useNavigate();

  const { toastMessage, message } = allMessage();
  const [isActice, setIsActive] = useState(false);
  const [values, setValues] = useState({
    name: "",
    icon: "",
    url: "",
    is_active: isActice,
  });

  const getToken = localStorage.getItem("token");
  const token = JSON.parse(getToken);

  const refreshData = useCallback(() => {
    axios
      .get("https://project-ii-server.vercel.app/menu", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => res.data)
      .catch((err) => {
        console.error(err);
      });
  }, [token]);

  const handleChange = useCallback(
    (e) => {
      const newValue =
        e.target.type === "checkbox" ? e.target.checked : e.target.value;
      setValues((prevValues) => ({ ...prevValues, [e.target.name]: newValue }));
    },
    []
  );

  const handleActiveChange = useCallback(() => {
    setIsActive((prevIsActive) => !prevIsActive);
  }, []);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();

      validationMenu
        .validate(values, { abortEarly: false })
        .then(() => {
          axios
            .post("https://project-ii-server.vercel.app/insert-menu", values, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then((res) => {
              navigate("/menu-manajement", {
                state: { messageInsertMenu: res.data.message },
              });
              refreshData();
              onClose(); // Tutup modal setelah berhasil menambahkan menu
            })
            .catch((err) => {
              console.log(err);
              toastMessage("error", err.message);
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
    },
    [values, refreshData, token, validationMenu, onClose, toastMessage]
  );

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
                Menu Name
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
            <div className="form-modal-area-row">
              <label htmlFor="icon" className="form-label">
                Menu Icon
              </label>
              <input
                onChange={handleChange}
                type="text"
                id="icon"
                name="icon"
                className="form-input"
                value={values.icon}
              />
            </div>
            <div className="form-modal-area-row">
              <label htmlFor="url" className="form-label">
                Menu Url
              </label>
              <input
                onChange={handleChange}
                type="text"
                id="url"
                name="url"
                className="form-input"
                value={values.url}
              />
            </div>
            <div className="form-modal-area-row">
              <label htmlFor="is_active" className="form-label">
                Active?
              </label>
              <input
                onChange={(e) => {
                  handleChange(e);
                  handleActiveChange();
                }}
                checked={values.is_active}
                type="checkbox"
                id="is_active"
                name="is_active"
                className="form-checked"
              />
            </div>
            <button type="submit" className="form-submit">
              Add Menu
            </button>
          </form>
        </div>
      </div>
      {message && <ToastContainer />}
    </>
  );
}
