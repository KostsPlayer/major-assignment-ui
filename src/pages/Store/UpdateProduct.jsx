import React, { useEffect, useState } from "react";
import axios from "axios";
import { allMessage } from "../../component/Helper/LogicServer";
import { ToastContainer } from "react-toastify";

export default function UpdateProduct({ onOpen, onClose, productId }) {
  axios.defaults.withCredentials = true;
  if (!onOpen) return null;

  const { toastMessage, message } = allMessage();
  const [getCategory, setGetCategory] = useState([]);
  const [getProduct, setGetProduct] = useState({});
  
  const getToken = localStorage.getItem("token");
  const token = JSON.parse(getToken);

  const handleChange = (e) => {
    if (e.target.type === "file") {
      setGetProduct({ ...getProduct, [e.target.name]: e.target.files });
    } else {
      setGetProduct({ ...getProduct, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Form Values:", getProduct);

    const formData = new FormData();
    formData.append("name", getProduct.name);
    formData.append("description", getProduct.description);
    formData.append("price", getProduct.price);
    formData.append("stock", getProduct.stock);
    formData.append("category", getProduct.category);
    formData.append("image", getProduct.image);

    axios
      .put(
        `https://project-ii-server.vercel.app/update-product/${productId}`,
        formData,
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

  useEffect(() => {
    axios
      .get(`https://project-ii-server.vercel.app/get-product/${productId}`)
      .then((res) => {
        setGetProduct(res.data[0]);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [productId]);

  return (
    <>
      <div className={`overlay-modal`} onClick={onClose}>
        <div
          className={`modal-area`}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <h1>Update Modal</h1>
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
                value={getProduct?.name || ""}
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
                value={getProduct?.description || ""}
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
                value={getProduct?.price || ""}
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
                value={getProduct?.stock || ""}
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
                value={getProduct?.category || ""}
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
