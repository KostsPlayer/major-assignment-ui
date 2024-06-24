import React, { useState, useEffect } from "react";
import axios from "axios";
import Cursor from "../../component/Helper/Cursor";
import { allMessage } from "../../component/Helper/LogicServer";
import { ToastContainer } from "react-toastify";
import { Link } from "react-router-dom";
import Navbar from "../../component/Navbar/Navbar";

export default function Cart() {
  axios.defaults.withCredentials = true;
  const [getData, setGetData] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [checkedItem, setCheckedItem] = useState({});
  const { message, toastMessage } = allMessage();
  const getLocalStorage = JSON.parse(localStorage.getItem("dataUser"));

  const fetchData = () => {
    axios
      .get(
        `https://project-ii-server.vercel.app/cart/${getLocalStorage.dataUser.id}`
      )
      .then((res) => {
        const initialCheckedItems = res.data.reduce((acc, item) => {
          acc[item.id] = item.status === 1;
          return acc;
        }, {});

        setCheckedItem(initialCheckedItems);
        setGetData(res.data);
        calculateTotalPrice(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  useEffect(() => {
    fetchData();
  }, [getData, totalPrice, checkedItem]);

  const calculateTotalPrice = (cartData) => {
    const total = cartData.reduce((acc, { status, amount, product }) => {
      if (status === 1) {
        const itemPrice = amount * product.price;
        return acc + itemPrice;
      }
      return acc;
    }, 0);

    setTotalPrice(total);
  };

  const updateCartAmount = (id, newAmount) => {
    axios
      .put(`https://project-ii-server.vercel.app/update-cart-amount/${id}`, {
        amount: newAmount,
      })
      .then((res) => {
        const updatedData = getData.map((item) => {
          if (item.id === id) {
            return {
              ...item,
              amount: newAmount,
            };
          }
          return item;
        });

        setGetData(updatedData);
        calculateTotalPrice(updatedData);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleRemoveClick = (id, currentAmount) => {
    if (currentAmount > 0) {
      const newAmount = --currentAmount;
      updateCartAmount(id, newAmount);
    }
  };

  const handleAddClick = (id, currentAmount, stock) => {
    if (currentAmount < stock) {
      const newAmount = ++currentAmount;
      updateCartAmount(id, newAmount);
    }
  };

  const handleChecked = (id) => {
    const newCheckedItems = { ...checkedItem };
    newCheckedItems[id] = !checkedItem[id];
    setCheckedItem(newCheckedItems);

    axios
      .put(`https://project-ii-server.vercel.app/update-cart-status/${id}`, {
        status: newCheckedItems[id] ? 1 : 0,
      })
      .then((res) => {
        setGetData(res.data);
        calculateTotalPrice(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleDelete = (id) => {
    axios
      .put(`https://project-ii-server.vercel.app/delete-cart/${id}`)
      .then((res) => {
        toastMessage("success", res.data.message);
      })
      .catch((err) => {
        console.error(err);
      });
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
      <div className="cart">
        <div className="cart-container">
          {getData.map(({ id, product, amount }, index) => (
            <div className="cart-item" key={index}>
              <input
                onChange={() => handleChecked(id)}
                type="checkbox"
                name="status"
                checked={checkedItem[id]}
              />

              <div className="cart-item-image">
                <img
                  src={`https://crijtkbvmmpjdbxqqkpi.supabase.co/storage/v1/object/public/Images/${
                    product && product.images
                  }`}
                  alt={product && product.name}
                />
              </div>
              <div className="cart-item-detail">
                <p>Nama: {product && product.name}</p>
                <p>Harga: {product && product.price}</p>
                <p>Total: {amount * (product && product.price)}</p>
                <div className="cart-count">
                  <span
                    className="material-symbols-outlined"
                    onClick={() => handleRemoveClick(id, amount)}
                  >
                    remove
                  </span>
                  <p>{amount}</p>
                  <span
                    className="material-symbols-outlined"
                    onClick={() =>
                      handleAddClick(id, amount, product && product.stock)
                    }
                  >
                    add
                  </span>
                  <div className="delete">
                    <div
                      className="bagde-icon"
                      onClick={() => handleDelete(id)}
                    >
                      <span className="material-symbols-outlined">delete</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="cart-total">
          <h1 className="h1-test">Total Price : {totalPrice}</h1>
          <Link to={`/order`}>
            <button>Buy</button>
          </Link>
        </div>
      </div>
      {message && <ToastContainer />}
    </>
  );
}
