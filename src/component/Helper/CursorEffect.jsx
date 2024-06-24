import { gsap } from "gsap";

export const scaleOnEnter = (
  scaleCursor = 1,
  scaleFollow = 1,
  ease = "none"
) => {
  gsap.to(".cursor", {
    scale: scaleCursor,
    ease: ease,
  });
  gsap.to(".cursor-follow", {
    scale: scaleFollow,
    ease: ease,
    backgroundColor: "#fff",
  });
};

export const scaleOnLeave = (
  scaleCursor = 0.2,
  scaleFollow = 1,
  ease = "none"
) => {
  gsap.to(".cursor", {
    scale: scaleCursor,
    ease: ease,
  });
  gsap.to(".cursor-follow", {
    scale: scaleFollow,
    ease: ease,
    backgroundColor: "transparent",
  });
};
