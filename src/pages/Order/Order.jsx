import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useLocation } from "react-router-dom";
import Cursor from "../../component/Helper/Cursor";
import Navbar from "../../component/Navbar/Navbar";
import { allMessage } from "../../component/Helper/LogicServer";
import { ToastContainer } from "react-toastify";

export default function Order() {
  axios.defaults.withCredentials = true;
  const location = useLocation();
  const { id } = useParams();
  const [data, setData] = useState({});
  const [getPayment, setGetPayment] = useState([]);
  const [getShipping, setGetShipping] = useState([]);
  const [getAddress, setGetAddress] = useState([]);
  const [quantity, setQuantity] = useState(location.state.quantity);
  const [totalPrice, setTotalPrice] = useState(location.state.totalPrice);
  const { toastMessage, message } = allMessage();

  const getLocalStorage = JSON.parse(localStorage.getItem("dataUser"));
  const userId = getLocalStorage.dataUser.id;
  const userName = getLocalStorage.dataUser.name;
  const userEmail = getLocalStorage.dataUser.email;
  const userPhoneNumber = getLocalStorage.dataUser.phone_number;

  useEffect(() => {
    axios
      .get(`https://project-ii-server.vercel.app/address/${userId}`)
      .then((res) => {
        setGetAddress(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const [values, setValues] = useState({
    address: "",
    paymentMethod: 0,
    shippingMethod: 0,
    amount: quantity,
    productId: id,
    grossAmount: totalPrice,
    userId: userId,
    email: userEmail,
    name: userName,
    phoneNumber: userPhoneNumber,
  });

  useEffect(() => {
    axios
      .get(`https://project-ii-server.vercel.app/get-product/${id}`)
      .then((res) => {
        setData(res.data[0]);
      })
      .catch((err) => {
        console.error(err);
      });

    console.log(location);
  }, [id]);

  const newPrice = Math.round(data.price + data.price * (15 / 100));

  useEffect(() => {
    setTotalPrice(newPrice * quantity);
  }, [newPrice, quantity]);

  useEffect(() => {
    setValues({
      ...values,
      amount: quantity,
    });
  }, [quantity]);

  useEffect(() => {
    axios
      .get("https://project-ii-server.vercel.app/get-payment")
      .then((res) => {
        setGetPayment(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    axios
      .get("https://project-ii-server.vercel.app/get-shipping")
      .then((res) => {
        setGetShipping(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post("https://project-ii-server.vercel.app/insert-order", values)
      .then((res) => {
        toastMessage("success", res.data.message);
        console.log(res.data);
      })
      .catch((err) => {
        console.error(err);
      });

    console.log(values);
  };

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

  return (
    <>
      <Cursor />
      <Navbar />
      <span
        className="material-symbols-outlined"
        onClick={() => {
          window.history.back();
        }}
      >
        arrow_back
      </span>
      <div className="order">
        <div className="order-image">
          <img
            src={`https://crijtkbvmmpjdbxqqkpi.supabase.co/storage/v1/object/public/Images/${data.images}?t=2023-12-24T02%3A30%3A45.365Z`}
            alt={data.name}
            width={300}
            height={300}
          />
          <input
            type="text"
            placeholder="Adress"
            name="address"
            id="address"
            onChange={handleChange}
            value={values.address}
          />
          <input
            type="text"
            placeholder="Phone Number"
            name="phoneNumber"
            id="phoneNumber"
            onChange={handleChange}
            value={values.phoneNumber}
          />
          <select
            name="paymentMethod"
            id="paymentMethod"
            onChange={handleChange}
            value={values.paymentMethod}
          >
            <option value="" disabled selected>
              Select Payment Method
            </option>
            {getPayment.map((payment, index) => (
              <option key={index} value={payment.id}>
                {payment.name}
              </option>
            ))}
          </select>
          <select
            name="shippingMethod"
            id="shippingMethod"
            onChange={handleChange}
            value={values.shippingMethod}
          >
            <option value="" disabled selected>
              Select Shipping Method
            </option>
            {getShipping.map((shipping, index) => (
              <option key={index} value={shipping.id}>
                {shipping.name}
              </option>
            ))}
          </select>
        </div>
        <div className="order-detail">
          <p>Nama: {data.name}</p>
          <p>Harga: {data.price}</p>
          <p>Stock: {data.stock}</p>
          <p>Category: {data.category_name}</p>
          <div className="order-count">
            <span
              className="material-symbols-outlined"
              onClick={handleRemoveClick}
            >
              remove
            </span>
            <p>{quantity}</p>
            <span
              className="material-symbols-outlined"
              onClick={handleAddClick}
            >
              add
            </span>
          </div>
          <p>Total Price : {totalPrice}</p>
          <button onClick={handleSubmit}>Beli</button>
        </div>
      </div>
      {message && <ToastContainer />}
    </>
  );
}
