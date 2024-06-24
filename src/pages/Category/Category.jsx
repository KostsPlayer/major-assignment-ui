import React, { useEffect, useState } from "react";
import InsertCategory from "./InsertCategory";
import UpdateCategory from "./UpdateCategory";
import Layout from "../Layout/Layout";
import axios from "axios";
import { allMessage } from "../../component/Helper/LogicServer";
import { ToastContainer } from "react-toastify";
import moment from "moment";
moment.locale("id");

export default function Category() {
  axios.defaults.withCredentials = true;
  const [openInsertModal, setOpenInsertModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [dataCategory, setDataCategory] = useState([]);
  const [getId, setGetId] = useState(0);
  let no = 1;

  const { toastMessage, message } = allMessage();

  const getToken = localStorage.getItem("token");
  const token = JSON.parse(getToken);

  const handleCategory = (categoryId) => {
    axios
      .get(`https://project-ii-server.vercel.app/get-category/${categoryId}`, {
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
  };

  const handleDelete = (id) => {
    axios
      .delete(`https://project-ii-server.vercel.app/delete-category/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        toastMessage("success", res.data.message);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  useEffect(() => {
    axios
      .get("https://project-ii-server.vercel.app/category")
      .then((res) => {
        setDataCategory(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [getId, dataCategory]);

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

        <InsertCategory
          onOpen={openInsertModal}
          onClose={() => {
            setOpenInsertModal(false);
          }}
          title={"+ New Category"}
        />

        <UpdateCategory
          onOpen={openUpdateModal}
          onClose={() => {
            setOpenUpdateModal(false);
          }}
          categoryId={getId}
          title={"Update Category"}
        />

        <table className="table-category">
          <thead>
            <tr>
              <th>No</th>
              <th>Name</th>
              <th>Date Available</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {dataCategory.map((data, index) => {
              return (
                <tr key={index}>
                  <td>{no++}</td>
                  <td>{data.name}</td>
                  <td>
                    {moment(data.date_available).format("dddd, D MMMM YYYY")}
                  </td>
                  <td>
                    <div className="edit">
                      <div
                        className="bagde-icon"
                        onClick={() => {
                          setOpenUpdateModal(true);
                          handleCategory(data.id);
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
