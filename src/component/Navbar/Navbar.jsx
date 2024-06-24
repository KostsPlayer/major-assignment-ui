import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { NavbarCursor, NavbarAnimation } from "./NavbarProperty";

export default function Navbar() {
  axios.defaults.withCredentials = true;
  const { navbar, magnets } = NavbarAnimation();
  const { onEnterNavbar, onLeaveNavbar } = NavbarCursor();
  const redirect = useNavigate();

  const [isValid, setIsValid] = useState(false);
  const [getData, setGetData] = useState([]);
  const [getCount, setGetCount] = useState(0);

  const getSession = localStorage.getItem("session");
  const getImageUrl = JSON.parse(localStorage.getItem("imageUrl"));
  const getStorage = JSON.parse(localStorage.getItem("dataUser"));

  useEffect(() => {
    if (getSession) {
      // axios
      //   .get(
      //     `https://project-ii-server.vercel.app/count-cart/${getStorage.dataUser.id}`
      //   )
      //   .then((res) => {
      //     setGetCount(res.data);
      //   })
      //   .catch((err) => {
      //     console.error(err);
      //   });

      setGetData({ images: getImageUrl.imageUrl.publicUrl });
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  }, [getImageUrl, getStorage, getCount]);

  const logout = () => {
    localStorage.setItem("logoutMessage", "Logged out successfully!");
    localStorage.removeItem("dataUser");
    localStorage.removeItem("imageUrl");
    localStorage.removeItem("session");
    localStorage.removeItem("token");
    redirect("/login");
  };

  return (
    <>
      <nav className="nav-nav" ref={navbar}>
        <Link
          to="/major-assignment-ui"
          className="nav-logo"
          onMouseEnter={onEnterNavbar}
          onMouseLeave={onLeaveNavbar}
          ref={(e) => e && magnets.current.push(e)}
        >
          Shopionz
        </Link>
        <ul className="nav-ul">
          <li
            className="nav-li"
            onMouseEnter={onEnterNavbar}
            onMouseLeave={onLeaveNavbar}
            ref={(e) => e && magnets.current.push(e)}
          >
            <Link className="nav-link" to="/major-assignment-ui">
              Home
            </Link>
          </li>
          <li
            className="nav-li"
            onMouseEnter={onEnterNavbar}
            onMouseLeave={onLeaveNavbar}
            ref={(e) => e && magnets.current.push(e)}
          >
            <Link className="nav-link" to="/product">
              Product
            </Link>
          </li>
          <li
            className="nav-li"
            onMouseEnter={onEnterNavbar}
            onMouseLeave={onLeaveNavbar}
            ref={(e) => e && magnets.current.push(e)}
          >
            <Link className="nav-link" to="/about-us">
              About Us
            </Link>
          </li>
        </ul>
        <div className="nav-icon">
          <span
            className="material-symbols-outlined"
            onMouseEnter={onEnterNavbar}
            onMouseLeave={onLeaveNavbar}
            ref={(e) => e && magnets.current.push(e)}
          >
            search
          </span>
          <Link
            className="shopping-cart"
            onMouseEnter={onEnterNavbar}
            onMouseLeave={onLeaveNavbar}
            ref={(e) => e && magnets.current.push(e)}
            to={"/cart"}
          >
            <span className="material-symbols-outlined">local_mall</span>
            {/* {isValid && <div className="shopping-cart-count">{getCount}</div>} */}
          </Link>
          <Link
            onMouseEnter={onEnterNavbar}
            onMouseLeave={onLeaveNavbar}
            ref={(e) => e && magnets.current.push(e)}
            className="icon-login"
            to={isValid ? "/dashboard" : "/login"}
          >
            {isValid ? (
              <img className="home-user-image" src={getData.images} />
            ) : (
              <>
                <span className="material-symbols-outlined">person</span>
              </>
            )}
          </Link>
          {isValid && (
            <span
              className="material-symbols-outlined"
              onMouseEnter={onEnterNavbar}
              onMouseLeave={onLeaveNavbar}
              ref={(e) => e && magnets.current.push(e)}
              onClick={logout}
            >
              logout
            </span>
          )}
        </div>
      </nav>
    </>
  );
}
