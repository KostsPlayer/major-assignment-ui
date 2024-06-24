import React, { useEffect, useState } from "react";
import Cursor from "../../component/Helper/Cursor";
import Navbar from "../../component/Navbar/Navbar";
import axios from "axios";

export default function Product() {
  axios.defaults.withCredentials = true;
  const [data, setData] = useState([]);

  useEffect(() => {
    const getLocalStorage = JSON.parse(localStorage.getItem("dataUser"));

    setData(getLocalStorage);
  }, []);

  return (
    <>
      <Navbar />
      <Cursor />
      <div className="product">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Password</th>
              <th>Image</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {data.map((user, index) => (
              <tr key={index}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.password}</td>
                <td>
                  <img
                    src={`https://crijtkbvmmpjdbxqqkpi.supabase.co/storage/v1/object/public/Images/${user.image}?t=2023-12-24T02%3A30%3A45.365Z`}
                    alt={`profile-${user.name}`}
                  />
                </td>
                <td>{user.date_available}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

// fetch("https://project-ii-server.vercel.app/users")
//   .then((res) => res.json())
//   .then((data) => setData(data))
//   .catch((err) => console.log(err));
