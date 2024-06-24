import React, { useEffect, useState } from "react";
import axios from "axios";
import { allMessage } from "../../component/Helper/LogicServer";
import { ToastContainer } from "react-toastify";

export default function InsertProduct({ onOpen, onClose }) {
  axios.defaults.withCredentials = true;
  if (!onOpen) return null;
  const { toastMessage, message } = allMessage();

  const [getCategory, setGetCategory] = useState([]);
  const getToken = localStorage.getItem("token");
  const token = JSON.parse(getToken);

  useEffect(() => {
    axios
      .get("https://project-ii-server.vercel.app/category")
      .then((res) => {
        setGetCategory(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const [values, setValues] = useState({
    name: "",
    description: "",
    price: 0,
    stock: 0,
    category: 1,
    image: "",
  });

  const handleChange = (e) => {
    if (e.target.type === "file") {
      setValues({ ...values, [e.target.name]: e.target.files });
    } else {
      if (
        (e.target.name === "price" || e.target.name === "stock") &&
        parseFloat(e.target.value) < 0
      ) {
        return toastMessage("error", "Cannot Negatif");
      }
      setValues({ ...values, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Form Values:", values);

    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("description", values.description);
    formData.append("price", values.price);
    formData.append("stock", values.stock);
    formData.append("category", values.category);
    formData.append("image", values.image[0]);

    const getLocalStorage = JSON.parse(localStorage.getItem("dataUser"));

    axios
      .post(
        `https://project-ii-server.vercel.app/insert-product/${getLocalStorage.dataUser.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        console.log(res.data);
        toastMessage("success", res.data.message);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <>
      <div className={`overlay-modal`} onClick={onClose}>
        <div
          className={`modal-area`}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <h1>Insert Modal</h1>
          <span onClick={onClose} className="material-symbols-outlined">
            close
          </span>
          <form
            className="form-modal-area"
            onSubmit={handleSubmit}
            encType="multipart/form-data"
          >
            <div className="form-modal-area-row">
              <label htmlFor="name" className="form-label">
                product Name
              </label>
              <input
                onChange={handleChange}
                type="text"
                id="name"
                name="name"
                className="form-input"
                value={values.name}
              />
            </div>
            <div className="form-modal-area-row">
              <label htmlFor="description" className="form-label">
                Description
              </label>
              <textarea
                onChange={handleChange}
                id="description"
                name="description"
                className="form-input"
                value={values.description}
                cols="30"
                rows="10"
              ></textarea>
            </div>
            <div className="form-modal-area-row">
              <label htmlFor="price" className="form-label">
                Price
              </label>
              <input
                onChange={handleChange}
                type="number"
                id="price"
                name="price"
                className="form-input"
                value={values.price}
              />
            </div>
            <div className="form-modal-area-row">
              <label htmlFor="stock" className="form-label">
                Stock
              </label>
              <input
                onChange={handleChange}
                type="number"
                id="stock"
                name="stock"
                className="form-input"
                value={values.stock}
              />
            </div>
            <div className="form-modal-area-row">
              <label htmlFor="category" className="form-label">
                Category
              </label>
              <select
                id="category"
                name="category"
                className="form-input"
                onChange={handleChange}
                value={values.category}
              >
                <option value="" disabled>
                  Select Category
                </option>
                {getCategory.map((category, index) => (
                  <option key={index} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-modal-area-row">
              <label htmlFor="image" className="form-label">
                Image
              </label>
              <input
                onChange={handleChange}
                type="file"
                id="image"
                name="image"
                className="form-input"
              />
            </div>
            <button type="submit" className="form-submit">
              Add Product
            </button>
          </form>
        </div>
      </div>
      {message && <ToastContainer />}
    </>
  );
}
