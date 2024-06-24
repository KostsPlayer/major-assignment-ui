import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { allMessage, validationMenu } from "../../component/Helper/LogicServer";
import { ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function UpdateMenu({ onOpen, onClose, menuId, title }) {
  axios.defaults.withCredentials = true;
  if (!onOpen) return null;
  const { toastMessage, message } = allMessage();
  const [isActive, setIsActive] = useState(false);
  const [getMenu, setGetMenu] = useState({});

  const navigate = useNavigate();

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

  useEffect(() => {
    axios
      .get(`https://project-ii-server.vercel.app/get-menu/${menuId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setGetMenu(res.data[0]);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [menuId, token]);

  const handleChange = useCallback(
    (e) => {
      const newValue =
        e.target.type === "checkbox" ? e.target.checked : e.target.value;
      setGetMenu((prevMenu) => ({ ...prevMenu, [e.target.name]: newValue }));
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
        .validate(getMenu, { abortEarly: false })
        .then(() => {
          axios
            .put(
              `https://project-ii-server.vercel.app/update-menu/${menuId}`,
              getMenu,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            )
            .then((res) => {
              navigate("/menu-manajement", {
                state: { messageUpdateMenu: res.data.message },
              });
              refreshData();
              onClose();
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
    },
    [
      getMenu,
      refreshData,
      token,
      validationMenu,
      onClose,
      navigate,
      toastMessage,
    ]
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
                value={getMenu?.name || ""}
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
                value={getMenu?.icon || ""}
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
                value={getMenu?.url || ""}
              />
            </div>
            <div className="form-modal-area-row">
              <label htmlFor="is_active" className="form-label">
                Active?
              </label>
              <input
                onChange={(e) => {
                  handleActiveChange();
                  handleChange(e);
                }}
                type="checkbox"
                id="is_active"
                name="is_active"
                className="form-checked"
                checked={getMenu?.is_active || false}
              />
            </div>
            <button type="submit" className="form-submit">
              Update Menu
            </button>
          </form>
        </div>
      </div>
      {message && <ToastContainer />}
    </>
  );
}
