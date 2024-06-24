import React, { useEffect } from "react";
import Layout from "../Layout/Layout";
import { allMessage } from "../../component/Helper/LogicServer";
import { ToastContainer } from "react-toastify";

export default function Dashboard() {
  const { message, toastMessage } = allMessage();

  useEffect(() => {
    const loginMessage = localStorage.getItem("loginMessage");

    if (loginMessage) {
      toastMessage("success", loginMessage);
      localStorage.removeItem("loginMessage");
    }
  }, []);

  return (
    <>
      <Layout>
        <h1>Hello World!</h1>
        {message && <ToastContainer />}
      </Layout>
    </>
  );
}
