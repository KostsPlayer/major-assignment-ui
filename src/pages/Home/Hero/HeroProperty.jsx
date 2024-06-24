import React, { useMemo, useRef } from "react";
import {
  scaleOnEnter,
  scaleOnLeave,
} from "../../../component/Helper/CursorEffect";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, Parallax } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import image2 from "./../../../assets/image/2.jpg";
import image3 from "./../../../assets/image/3.jpg";
import image4 from "./../../../assets/image/4.jpg";
import image5 from "./../../../assets/image/5.jpg";
import image6 from "./../../../assets/image/6.jpg";
import image7 from "./../../../assets/image/7.jpg";

export function Carousel() {
  const caroselRef = useRef(null);

  const handleNextButton = () => {
    caroselRef.current.swiper.slideNext();
  };

  const handlePrevButton = () => {
    caroselRef.current.swiper.slidePrev();
  };

  const images = useMemo(
    () => [image2, image3, image4, image5, image6, image7],
    []
  );

  return (
    <>
      <Swiper
        slidesPerView={1}
        loop={true}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        parallax={true}
        speed={1000}
        pagination={{
          clickable: true,
        }}
        navigation={false}
        modules={[Autoplay, Pagination, Navigation, Parallax]}
        className="hero-carousel-swiper"
        ref={caroselRef}
      >
        {images.map((image, index) => (
          <SwiperSlide key={index}>
            <img src={image} className="swiper-image" loading="lazy" />
          </SwiperSlide>
        ))}
        <div className="navigation-control">
          <div className="prev" onClick={handlePrevButton}>
            <span className="material-symbols-outlined">navigate_before</span>
          </div>
          <div className="next" onClick={handleNextButton}>
            <span className="material-symbols-outlined">navigate_next</span>
          </div>
        </div>
      </Swiper>
    </>
  );
}

export function HeroCursorTitle() {
  const onEnterTitle = () => {
    scaleOnEnter(3, 3);
  };
  const onLeaveTitle = () => {
    scaleOnLeave(0.2, 1);
  };

  return { onEnterTitle, onLeaveTitle };
}
