import React, { useState, useEffect } from "react";
import Layout from "../Layout/Layout";
import axios from "axios";
import { Link } from "react-router-dom";
import { allMessage } from "../../component/Helper/LogicServer";
import { ToastContainer } from "react-toastify";
import moment from "moment";
moment.locale("id");

export default function Profile() {
  axios.defaults.withCredentials = true;
  const [dataUser, setDataUser] = useState([]);
  const [dataAddress, setDataAddress] = useState([]);
  const [values, setValues] = useState({});

  const getToken = localStorage.getItem("token");
  const token = JSON.parse(getToken);

  const getLocalStorage = JSON.parse(localStorage.getItem("dataUser"));
  const getImageUrl = JSON.parse(localStorage.getItem("imageUrl"));
  const { message, toastMessage } = allMessage();

  useEffect(() => {
    axios
      .get(
        `https://project-ii-server.vercel.app/address/${getLocalStorage.dataUser.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        setDataAddress(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [token]);

  useEffect(() => {
    const getDate = moment(getLocalStorage.dataUser.date_available);
    const customDate = getDate.format("dddd, D MMMM YYYY");

    setDataUser({
      role: getLocalStorage.dataUser.roles.roles,
      date: customDate,
      image: getImageUrl.imageUrl.publicUrl,
    });
  }, []);

  useEffect(() => {
    const fecthDataProfile = () => {
      axios
        .get(
          `https://project-ii-server.vercel.app/profile/${getLocalStorage.dataUser.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          setValues(res.data[0]);
        })
        .catch((err) => {
          console.error(err);
        });
    };

    fecthDataProfile();
  }, [token]);

  const handleChange = (e) => {
    if (e.target.type === "file") {
      setValues({ ...values, [e.target.name]: e.target.files });
    } else {
      setValues({
        ...values,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("email", values.email);
    formData.append("phone_number", values.phone_number);
    formData.append("image", values.image[0]);

    axios
      .put(
        `https://project-ii-server.vercel.app/update-profile/${getLocalStorage.dataUser.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        localStorage.removeItem("dataUser");
        localStorage.removeItem("imageUrl");

        localStorage.setItem(
          "dataUser",
          JSON.stringify({ dataUser: res.data.dataUser })
        );
        localStorage.setItem(
          "imageUrl",
          JSON.stringify({ imageUrl: res.data.imageUrl })
        );
        toastMessage("success", res.data.message);
        console.log(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleDeleteAddress = (id) => {
    axios
      .delete(
        `https://project-ii-server.vercel.app/delete-address/${id}`,
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
        console.error(err);
      });
  };

  const handleMainAddress = (id) => {
    axios
      .put(
        `https://project-ii-server.vercel.app/main-address/${id}`,
        {
          status: true,
          userId: getLocalStorage.dataUser.id,
        },
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
        console.error(err);
      });
  };

  return (
    <>
      <Layout>
        <div className="profile">
          <form
            className="profile-form"
            encType="multipart/form-data"
            onSubmit={handleSubmit}
          >
            <div className="profile-form-image">
              <img src={dataUser.image} alt="profile-user" />
              <label htmlFor="image" className="profile-image-label">
                <input
                  type="file"
                  name="image"
                  id="image"
                  onChange={handleChange}
                />
                Select Image
              </label>
            </div>
            <div className="profile-form-desc">
              <div className="profile-form-desc-row">
                <label htmlFor="name">Username</label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={values?.name || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="profile-form-desc-row">
                <label htmlFor="email">Email</label>
                <input
                  type="text"
                  name="email"
                  id="email"
                  value={values?.email || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="profile-form-desc-row">
                <label htmlFor="phone_number">Phone Number</label>
                <input
                  type="text"
                  name="phone_number"
                  id="phone_number"
                  value={values?.phone_number || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="profile-form-desc-row">
                <label htmlFor="role">Role</label>
                <input
                  type="text"
                  name="role"
                  id="role"
                  value={dataUser.role}
                  disabled
                />
              </div>
              <div className="profile-form-desc-row">
                <label htmlFor="date">Registered since</label>
                <input
                  type="text"
                  name="date"
                  id="date"
                  value={dataUser.date}
                  disabled
                />
              </div>
              <button type="submit">Submit</button>
            </div>
          </form>
          <div className="profile-address">
            <Link className="profile-address-add" to={"/address"}>
              + New Address
              <span class="material-symbols-outlined">add_circle</span>
            </Link>
            {dataAddress.map(
              ({
                id,
                address,
                villages,
                districts,
                regencies,
                provincies,
                status,
              }) => (
                <div className="profile-address-item">
                  <div className="column-left">
                    {address}, {villages}, {districts}, {regencies},{" "}
                    {provincies}
                  </div>
                  <div className="column-right">
                    <div className="icon">
                      <div
                        className="delete"
                        onClick={() => handleDeleteAddress(id)}
                      >
                        <div className="bagde-icon">
                          <span className="material-symbols-outlined">
                            delete
                          </span>
                        </div>
                      </div>
                      <div className="edit">
                        <div className="bagde-icon">
                          <span className="material-symbols-outlined">
                            edit
                          </span>
                        </div>
                      </div>
                    </div>
                    <>
                      {status ? (
                        ""
                      ) : (
                        <div
                          className="set-main"
                          onClick={() => handleMainAddress(id)}
                        >
                          Set Main Address
                        </div>
                      )}
                    </>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
        {message && <ToastContainer />}
      </Layout>
    </>
  );
}

// validationProfile
//   .validate(formData, { abortEarly: false })
//   .then(() => {
//   })
//   .catch((errors) => {
//     const errorMessages = errors.inner.map((error) => (
//       <li key={error.path}>{error.message}</li>
//     ));
//     toastMessage(
//       "error",
//       <ul className="error-message">{errorMessages}</ul>,
//       "top-center"
//     );
//   });
