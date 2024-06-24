import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import Cursor from "../../component/Helper/Cursor";
import Navbar from "../../component/Navbar/Navbar";
import { allMessage } from "../../component/Helper/LogicServer";
import { ToastContainer } from "react-toastify";

export default function ProductId() {
  axios.defaults.withCredentials = true;
  const { id } = useParams();
  const [data, setData] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const redirect = useNavigate();
  const { message, toastMessage } = allMessage();

  useEffect(() => {
    axios
      .get(`https://project-ii-server.vercel.app/get-product/${id}`)
      .then((res) => {
        setData(res.data[0]);
        console.log(res.data[0]);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [id]);

  const newPrice = Math.round(data.price + data.price * (15 / 100));
  const categoryName = data.category && data.category.name;

  useEffect(() => {
    setTotalPrice(newPrice * quantity);
  }, [newPrice, quantity]);

  const handleRemoveClick = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddClick = () => {
    if (quantity < data.stock) {
      setQuantity(quantity + 1);
    }
  };

  const getLocalStorage = JSON.parse(localStorage.getItem("dataUser")) || {};

  const handleAddToCart = (e) => {
    const userId = getLocalStorage.dataUser?.id;
    const userPhoneNumber = getLocalStorage.dataUser?.phone_number;

    if (!userId) {
      toastMessage("warn", "You must login first to add product on cart!");
    } else if (!userPhoneNumber || userPhoneNumber === null) {
      toastMessage(
        "warn",
        "Please fill in the phone number on the profile page first."
      );
    } else {
      e.preventDefault();

      const valuesCart = {
        product_id: data.id,
        amount: quantity,
        userId: userId,
      };

      axios
        .post("https://project-ii-server.vercel.app/insert-cart", valuesCart)
        .then((res) => {
          console.log(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleBuyNow = () => {
    const userId = getLocalStorage.dataUser?.id;
    const userPhoneNumber = getLocalStorage.dataUser?.phone_number;

    if (!userId) {
      toastMessage("warn", "You must login first to buy some product!");
    } else if (!userPhoneNumber || userPhoneNumber === null) {
      toastMessage(
        "warn",
        "Please fill in the phone number on the profile page first."
      );
    } else {
      redirect(`/order/${id}`, {
        replace: true,
        state: { quantity, totalPrice },
      });
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(price);
  };

  return (
    <>
      <Cursor />
      <Navbar />
      <div className="product-id">
        <div className="product-id-image">
          <img
            src={`https://crijtkbvmmpjdbxqqkpi.supabase.co/storage/v1/object/public/Images/${data.images}`}
            alt={data.name}
          />
        </div>
        <div className="product-id-detail">
          <div className="left-side">
            <div className="left-side-top">
              <p className="left-side-top-name">{data.name}</p>
              <p className="left-side-top-price">{formatPrice(newPrice)}</p>
              <p className="left-side-top-category">{categoryName}</p>
            </div>
            <div className="left-side-bottom">
              <span className="left-side-bottom-title">Detail</span>
              <p className="left-side-bottom-data">{data.description}</p>
            </div>
          </div>
          <div className="right-side">
            <div className="right-side-top">
              <div className="right-side-top-count">
                <span
                  className="material-symbols-outlined"
                  onClick={handleRemoveClick}
                >
                  remove
                </span>
                <span className="quantity">{quantity}</span>
                <span
                  className="material-symbols-outlined"
                  onClick={handleAddClick}
                >
                  add
                </span>
              </div>
              <span className="right-side-top-stock">
                Total Stock: <span className="stock">{data.stock}</span>
              </span>
            </div>
            <div className="right-side-total">
              Subtotal price:{" "}
              <span className="total">{formatPrice(totalPrice)}</span>
            </div>
            <div className="right-side-button">
              <button className="border" onClick={handleAddToCart}>
                + Cart
              </button>
              <button className="full" onClick={handleBuyNow}>
                Buy
              </button>
            </div>
          </div>
        </div>
      </div>
      {message && <ToastContainer />}
    </>
  );
}
