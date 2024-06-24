import React from "react";
import { Carousel } from "./HeroProperty";

import image7 from "./../../../assets/image/7.jpg";

export default function Hero() {
  return (
    <>
      <div className="hero">
        <div className="hero-carousel">
          {/* <img src={image7}/> */}
          <Carousel />
        </div>
        <div className="hero-announcement">
          <div className="first"></div>
          <div className="second"></div>
        </div>
      </div>
    </>
  );
}
