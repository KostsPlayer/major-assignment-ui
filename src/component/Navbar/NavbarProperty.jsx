import { useRef } from "react";
import { gsap } from "gsap";
import { useIsomorphicLayoutEffect } from "../Helper/useIsomorphicLayoutEffect";
import { moveMagnet, outMagnet } from "../Helper/MagnetEffect";
import { scaleOnEnter, scaleOnLeave } from "../Helper/CursorEffect";

export function NavbarCursor() {
  const onEnterNavbar = () => {
    scaleOnEnter();
  };
  const onLeaveNavbar = () => {
    scaleOnLeave();
  };

  return { onEnterNavbar, onLeaveNavbar };
}

export function NavbarAnimation() {
  const magnets = useRef([]);
  const navbar = useRef();
  const magnetsElements = magnets.current;

  useIsomorphicLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray(magnetsElements).forEach((magnet) => {
        magnet.addEventListener("mousemove", moveMagnet);
        magnet.addEventListener("mouseout", outMagnet);
      });
    }, navbar);

    return () => ctx.revert();
  }, []);

  return { magnets, navbar };
}
