import { useRef } from "react";
import { useIsomorphicLayoutEffect } from "../Helper/useIsomorphicLayoutEffect.jsx";
import { gsap } from "gsap";
import { Observer } from "gsap/all";
gsap.registerPlugin(Observer);
import horizontalLoop from "../Helper/horizontalLoop.js";

const useGsapContext = (scope) => {
  const ctx = gsap.context(() => {}, scope);
  return ctx;
};
const speed = 2.5;

export function HeroSlider0() {
  const heroWallpaper0 = useRef();
  const ctx0 = useGsapContext(heroWallpaper0);

  useIsomorphicLayoutEffect(() => {
    ctx0.add(() => {
      const arraySelector = document.querySelectorAll(
        ".hero-wallpaper-0 .image"
      );

      const loop = horizontalLoop(arraySelector, {
        paused: false,
        repeat: -1,
        speed: 0.5,
      });

      Observer.create({
        type: "wheel",
        onChange: (self) => {
          const factor = self.deltaY > 0 ? -1 : 1;
          const tl = gsap.timeline();
          tl.to(loop, { timeScale: speed * factor, duration: 0.25 }).to(loop, {
            timeScale: 1 * factor,
            duration: 1,
          });
        },
      });
    });

    // arraySelector.forEach((image) => {
    //   image.addEventListener("mouseenter", (e) => {
    //     onEnterImage(e, 1.3);
    //     gsap.to(loop, { timeScale: 0, overwrite: true });
    //   });
    //   image.addEventListener("mouseleave", (e) => {
    //     onLeaveImage(e);
    //     gsap.to(loop, { timeScale: -1, overwrite: true });
    //   });
    // });
  }, []);

  return { heroWallpaper0 };
}
