import React, { useEffect } from "react";
import Hero from "./Hero/Hero";
import Hotsale from "./Hotsale/Hotsale";
import Catalog from "./Catalog/Catalog";
import Cursor from "../../component/Helper/Cursor";
import SmoothScroll from "../../component/Helper/SmoothScroll";
import Navbar from "../../component/Navbar/Navbar";
import { ToastContainer } from "react-toastify";
import { allMessage } from "../../component/Helper/LogicServer";

export default function Home() {
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
      <SmoothScroll />
      <Cursor />
      <Navbar />
      <Hero />
      <Hotsale />
      <Catalog />
      {message && <ToastContainer />}
    </>
  );
}
