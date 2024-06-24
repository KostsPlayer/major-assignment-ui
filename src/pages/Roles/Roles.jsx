import React, { useEffect } from "react";
import Cursor from "../../component/Helper/Cursor";
import { useNavigate, useParams } from "react-router-dom";
import { allMessage } from "../../component/Helper/LogicServer";
import { ToastContainer } from "react-toastify";
import axios from "axios";

export default function Roles() {
  axios.defaults.withCredentials = true;
  const { toastMessage, message } = allMessage();
  const redirect = useNavigate();

  const userIdFromRegistration = useParams();

  useEffect(() => {
    const registrationMessage = localStorage.getItem("registrationMessage");

    if (registrationMessage) {
      toastMessage("success", registrationMessage);
      localStorage.removeItem("registrationMessage");
    }
  }, []);

  const handleRoleSelection = (params) => {
    axios
      .post("https://project-ii-server.vercel.app/assign-role", {
        userId: userIdFromRegistration.id,
        role: params,
      })
      .then((res) => {
        localStorage.setItem("roleMessage", `Welcome to become a ${params}`);
        redirect("/login");
        console.log(res.data);
      })
      .catch((error) => {
        toastMessage("error", error);
        console.error(error);
      });

    console.log(params);
    console.log(userIdFromRegistration.id);
  };

  return (
    <>
      <Cursor />
      <div className="roles">
        <div className="roles-container-seller">
          <div className="seller" onClick={() => handleRoleSelection("Seller")}>
            <span className="material-symbols-outlined">add_business</span>
            <span className="roles-text">Seller</span>
          </div>
          <div className="swap"></div>
        </div>
        <div className="roles-container-buyer">
          <div className="buyer" onClick={() => handleRoleSelection("Buyer")}>
            <span className="material-symbols-outlined">add_shopping_cart</span>
            <span className="roles-text">Buyer</span>
          </div>
          <div className="swap"></div>
        </div>
      </div>
      {message && <ToastContainer />}
    </>
  );
}
