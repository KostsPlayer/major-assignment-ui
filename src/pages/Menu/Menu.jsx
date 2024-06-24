import React, { useEffect, useState, useCallback } from "react";
import InsertMenu from "./InsertMenu";
import UpdateMenu from "./UpdateMenu";
import Layout from "../Layout/Layout";
import axios from "axios";
import { allMessage } from "../../component/Helper/LogicServer";
import { ToastContainer } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";

export default function Menu() {
  axios.defaults.withCredentials = true;
  const [openInsertModal, setOpenInsertModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [dataMenu, setDataMenu] = useState([]);
  const [getId, setGetId] = useState(0);
  let no = 1;

  const { toastMessage, message } = allMessage();
  const location = useLocation();
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
      .then((res) => {
        setDataMenu(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [token]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const handleMenu = useCallback(
    (menuId) => {
      axios
        .get(`https://project-ii-server.vercel.app/get-menu/${menuId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setGetId(res.data[0].id);
        })
        .catch((err) => {
          console.error(err);
        });
    },
    [token, setGetId]
  );

  const handleDelete = useCallback(
    (id) => {
      axios
        .delete(`https://project-ii-server.vercel.app/delete-menu/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          toastMessage("success", res.data.message);
          refreshData();
        })
        .catch((err) => {
          console.error(err);
        });
    },
    [token, refreshData, toastMessage]
  );

  useEffect(() => {
    if (location.state?.messageInsertMenu) {
      toastMessage("success", location.state.messageInsertMenu);
      navigate(location.pathname, {
        state: { ...location.state, messageInsertMenu: undefined },
        replace: true,
      });
    }

    if (location.state?.messageUpdateMenu) {
      toastMessage("success", location.state.messageUpdateMenu);
      navigate(location.pathname, {
        state: { ...location.state, messageUpdateMenu: undefined },
        replace: true,
      });
    }
  }, [location.state, location.pathname, navigate, toastMessage]);

  return (
    <>
      <Layout>
        <span
          className="material-symbols-outlined"
          onClick={() => {
            setOpenInsertModal(true);
          }}
        >
          add
        </span>

        <InsertMenu
          onOpen={openInsertModal}
          onClose={() => {
            setOpenInsertModal(false);
            refreshData();
          }}
          title={"Insert Menu"}
        />

        <UpdateMenu
          onOpen={openUpdateModal}
          onClose={() => {
            setOpenUpdateModal(false);
            refreshData();
          }}
          menuId={getId}
          title={"Update Menu"}
        />

        <table className="table-menu">
          <thead>
            <tr>
              <th>No</th>
              <th>Name</th>
              <th>Icon</th>
              <th>Activate</th>
              <th>Date Available</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {dataMenu.map((data, index) => {
              return (
                <tr key={index}>
                  <td>{no++}</td>
                  <td>{data.name}</td>
                  <td>{data.icon}</td>
                  <td>{data.is_active}</td>
                  <td>{data.date_available}</td>
                  <td>
                    <div className="edit">
                      <div
                        className="bagde-icon"
                        onClick={() => {
                          setOpenUpdateModal(true);
                          handleMenu(data.id);
                        }}
                      >
                        <span className="material-symbols-outlined">edit</span>
                      </div>
                    </div>
                    <div className="delete">
                      <div
                        className="bagde-icon"
                        onClick={() => handleDelete(data.id)}
                      >
                        <span className="material-symbols-outlined">
                          delete
                        </span>
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {message && <ToastContainer />}
      </Layout>
    </>
  );
}
