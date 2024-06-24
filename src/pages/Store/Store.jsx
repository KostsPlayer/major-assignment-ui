import React, { useEffect, useState } from "react";
import InsertProduct from "./InsertProduct";
import Layout from "../Layout/Layout";
import axios from "axios";
import UpdateProduct from "./UpdateProduct";
import { allMessage } from "../../component/Helper/LogicServer";
import { ToastContainer } from "react-toastify";
import moment from "moment";
moment.locale("id");

export default function Store() {
  axios.defaults.withCredentials = true;
  const [openInsertModal, setOpenInsertModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [dataProduct, setDataProduct] = useState([]);
  const [getId, setGetId] = useState(0);
  const [getImage, setGetImage] = useState("");
  const [activeContentArray, setActiveContentArray] = useState(
    Array(dataProduct.length).fill("detail")
  );
  const { toastMessage, message } = allMessage();
  const getLocalStorage = JSON.parse(localStorage.getItem("dataUser"));

  const getToken = localStorage.getItem("token");
  const token = JSON.parse(getToken);

  const handleProduct = async (productId) => {
    await axios
      .get(`https://project-ii-server.vercel.app/get-product/${productId}`)
      .then((res) => {
        setGetId(res.data[0].id);
        setGetImage(res.data[0].images);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleDelete = async (id) => {
    await axios
      .delete(
        `https://project-ii-server.vercel.app/delete-product/${id}`,
        getImage,
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

  const fecthDataProductSeller = () => {
    axios
      .get(
        `https://project-ii-server.vercel.app/product-seller/${getLocalStorage.dataUser.id}`
      )
      .then((res) => {
        setDataProduct(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(price);
  };

  useEffect(() => {
    fecthDataProductSeller();
  }, []);

  const initializeActiveContentArray = (length) => {
    return Array.from({ length }, () => "detail");
  };

  useEffect(() => {
    setActiveContentArray(initializeActiveContentArray(dataProduct.length));
  }, [dataProduct]);

  const handleButtonClick = (contentType, index) => {
    setActiveContentArray((prevArray) => {
      const newArray = [...prevArray];
      newArray[index] = contentType;
      return newArray;
    });
  };

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

        <InsertProduct
          onOpen={openInsertModal}
          onClose={() => {
            setOpenInsertModal(false);
          }}
        />
        <UpdateProduct
          onOpen={openUpdateModal}
          onClose={() => {
            setOpenUpdateModal(false);
          }}
          productId={getId}
        />

        <div className="store-gallery">
          {dataProduct.map(
            (
              {
                id,
                name,
                description,
                price,
                stock,
                images,
                date_available,
                category,
              },
              index
            ) => (
              <div className="gallery-card" key={index}>
                <img
                  className="gallery-images"
                  src={`https://crijtkbvmmpjdbxqqkpi.supabase.co/storage/v1/object/public/Images/${images}?t=2023-12-24T02%3A30%3A45.365Z`}
                />
                <div className="gallery-details">
                  <div className="gallery-details-button">
                    <button
                      className={
                        activeContentArray[index] === "detail" ? "active" : ""
                      }
                      onClick={() => handleButtonClick("detail", index)}
                    >
                      Details
                    </button>
                    <button
                      className={
                        activeContentArray[index] === "desc" ? "active" : ""
                      }
                      onClick={() => handleButtonClick("desc", index)}
                    >
                      Description
                    </button>
                    <button
                      className={
                        activeContentArray[index] === "action" ? "active" : ""
                      }
                      onClick={() => handleButtonClick("action", index)}
                    >
                      Action
                    </button>
                  </div>
                  <div className="gallery-details-content">
                    {activeContentArray[index] === "detail" && (
                      <>
                        <div className="paragraph">
                          <span>Name</span>
                          <span>: {name}</span>
                        </div>
                        <div className="paragraph">
                          <span>Price</span>
                          <span>: {formatPrice(price)}</span>
                        </div>
                        <div className="paragraph">
                          <span>Stock</span>
                          <span>: {stock}</span>
                        </div>
                        <div className="paragraph">
                          <span>Category</span>
                          <span>: {category.name}</span>
                        </div>
                        <span className="date">
                          {moment(date_available).format("dddd, D MMMM YYYY")}
                        </span>
                      </>
                    )}
                    {activeContentArray[index] === "desc" && (
                      <>
                        <span>{description}</span>
                      </>
                    )}
                    {activeContentArray[index] === "action" && (
                      <>
                        <div className="action">
                          <div className="edit">
                            <div
                              className="bagde-icon"
                              onClick={() => {
                                setOpenUpdateModal(true);
                                handleProduct(id);
                              }}
                            >
                              <span className="material-symbols-outlined">
                                edit
                              </span>
                            </div>
                          </div>
                          <div className="delete">
                            <div
                              className="bagde-icon"
                              onClick={() => handleDelete(id)}
                            >
                              <span className="material-symbols-outlined">
                                delete
                              </span>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )
          )}
        </div>

        {message && <ToastContainer />}
      </Layout>
    </>
  );
}

// const [currentPage, setCurrentPage] = useState(1);
// const recordsPerPage = 8;

// const lastIndex = currentPage * recordsPerPage;
// const firstIndex = lastIndex - recordsPerPage;
// const currentRecords = dataProduct.map(firstIndex, lastIndex);
// const paginate = (pageNumber) => setCurrentPage(pageNumber);

{
  /* <ul className="pagination">
          <li className="page-item">
            <Link
              to="#"
              onClick={() => {
                if (currentPage !== firstIndex) {
                  setCurrentPage(currentPage - 1);
                }
              }}
              className="page-link"
            >
              Prev
            </Link>
          </li>
          {Array.from(
            { length: Math.ceil(dataProduct.length / recordsPerPage) },
            (_, i) => (
              <>
                <li
                  key={i}
                  className={`page-item ${
                    currentPage === i + 1 ? "active" : ""
                  }`}
                >
                  <Link
                    to="#"
                    onClick={() => paginate(i + 1)}
                    className="page-link"
                  >
                    {i + 1}
                  </Link>
                </li>
              </>
            )
          )}
          <li className="page-item">
            <Link
              to="#"
              onClick={() => {
                if (currentPage !== lastIndex) {
                  setCurrentPage(currentPage + 1);
                }
              }}
              className="page-link"
            >
              Next
            </Link>
          </li>
        </ul> */
}
