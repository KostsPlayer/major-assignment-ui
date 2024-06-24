import React, { useMemo } from "react";
import {
  HotsaleCarousel,
  HotsaleTitle,
  HotsaleCursorTitle,
} from "./HotsaleProperty";

import image2 from "./../../../assets/image/2.jpg";
import image3 from "./../../../assets/image/3.jpg";
import image4 from "./../../../assets/image/4.jpg";
import image5 from "./../../../assets/image/5.jpg";
import image6 from "./../../../assets/image/6.jpg";
import image7 from "./../../../assets/image/7.jpg";

export default function Hotsale() {
  const { carousel } = HotsaleCarousel();
  const { hotsaleTitle } = HotsaleTitle();
  const { onEnterTitle, onLeaveTitle } = HotsaleCursorTitle();

  const images = useMemo(
    () => [image2, image3, image4, image5, image6, image7],
    []
  );

  return (
    <>
      <div className="hotsale">
        <div className="hotsale-title" ref={hotsaleTitle}>
          <span
            className="hotsale-title-text"
            onMouseEnter={onEnterTitle}
            onMouseLeave={onLeaveTitle}
          >
            <span className="hotsale-title-text-0">Special</span>
          </span>
          <span
            className="hotsale-title-text"
            onMouseEnter={onEnterTitle}
            onMouseLeave={onLeaveTitle}
          >
            <span className="hotsale-title-text-1">Offers</span>
          </span>
        </div>
        <div className="carousel" ref={carousel}>
          {images.map((image, index) => (
            <img
              key={index}
              src={image}
              loading="lazy"
              className="carousel-box"
            />
          ))}
          <div className="control">
            <button className="prev">
              <span className="material-symbols-outlined">
                arrow_circle_left
              </span>
            </button>
            <button className="next">
              <span className="material-symbols-outlined">
                arrow_circle_right
              </span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
