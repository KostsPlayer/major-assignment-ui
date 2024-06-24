import React, { useEffect, useState } from "react";
import Sidebar from "../Layout/Sidebar/Sidebar";
import Topbar from "../Layout/Topbar/Topbar";
import Cursor from "../../component/Helper/Cursor";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Layout({ children }) {
  axios.defaults.withCredentials = true;
  const redirect = useNavigate();
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    if (localStorage.getItem("session")) {
      setIsValid(true);
    } else {
      setIsValid(false);
      localStorage.setItem(
        "dashboardAccess",
        "You do not have access to the dashboard page!!"
      );
      redirect("/login");
    }
  }, []);

  return (
    <>
      {isValid && (
        <>
          <Cursor />
          <div className="layout">
            <div className="sidebar">
              <Sidebar />
            </div>
            <div className="topbar">
              <Topbar />
            </div>
            <div className="content">{children}</div>
          </div>
        </>
      )}
    </>
  );
}
