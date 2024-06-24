import React, { useMemo, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export function LayoutImageCatalog() {
  axios.defaults.withCredentials = true;
  const [product, setProduct] = useState([]);

  const number = 2+3
  useEffect(() => {
    axios
      .get("https://project-ii-server.vercel.app/product")
      .then((res) => {
        setProduct(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  // Love Click
  const [isClicked, setIsClicked] = useState(false);
  const clickLove = () => {
    setIsClicked(!isClicked);
  };

  const memoizedImages = useMemo(() => {
    return product.map(
      ({ images }) =>
        `https://crijtkbvmmpjdbxqqkpi.supabase.co/storage/v1/object/public/Images/${images}?t=2023-12-24T02%3A30%3A45.365Z`
    );
  }, [product]);

  return product.map(({ id, name, date_available, description }, index) => (
    <>
      <div className="catalog-box" key={id}>
        <div className="fullscreen-image">
          <img
            src={memoizedImages[index]}
            loading="lazy"
            className="box-image"
          />

          <div className="box-icon">
            <span
              className={`material-symbols-outlined love ${
                isClicked ? "clicked" : ""
              }`}
              onClick={clickLove}
            >
              favorite
            </span>
            <Link to={`/product/${id}`} className="link-detail">
              <span className="material-symbols-outlined info">info</span>
            </Link>
          </div>
        </div>
        <div className="box-desc">
          <div className="title">{name}</div>
          <div className="date">{date_available}</div>
          <div className="note">{description}</div>
        </div>
      </div>
    </>
  ));
}
