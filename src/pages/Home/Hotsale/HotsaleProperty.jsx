import { useRef } from "react";
import { useIsomorphicLayoutEffect } from "../../../component/Helper/useIsomorphicLayoutEffect";
import {
  scaleOnEnter,
  scaleOnLeave,
} from "../../../component/Helper/CursorEffect";
import horizontalLoop from "../../../component/Helper/horizontalLoop";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

export function HotsaleCarousel() {
  const carousel = useRef();

  useIsomorphicLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const next = document.querySelector(".next");
      const prev = document.querySelector(".prev");

      const timer = gsap.delayedCall(4, autoPlay);
      function autoPlay() {
        loop.next({ duration: 0.4, ease: "power2.inOut" });
        timer.restart(true);
      }

      const array = document.querySelectorAll(".carousel-box");
      const loop = horizontalLoop(array, {
        paused: true,
      });

      next.addEventListener("click", () =>
        loop.next({ duration: 0.4, ease: "power2.inOut" }, timer)
      );
      prev.addEventListener("click", () =>
        loop.previous({ duration: 0.4, ease: "power2.inOut" }, timer)
      );
    }, [carousel]);

    return () => ctx.revert();
  }, []);

  return { carousel };
}

export function HotsaleTitle() {
  const hotsaleTitle = useRef();

  useIsomorphicLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power4.in" },
        scrollTrigger: {
          trigger: ".hotsale-title-text",
          scrub: 1,
          start: "top bottom",
          end: "top bottom",
        },
      });
      tl.from(".hotsale-title-text-0", {
        yPercent: 120,
        duration: 20,
        autoAlpha: 0,
      }).from(
        ".hotsale-title-text-1",
        {
          yPercent: 120,
          duration: 20,
          autoAlpha: 0,
        },
        "<1"
      );
    }, hotsaleTitle);

    return () => ctx.revert();
  }, []);

  return { hotsaleTitle };
}

export function HotsaleCursorTitle() {
  const onEnterTitle = () => {
    scaleOnEnter(3, 3);
  };
  const onLeaveTitle = () => {
    scaleOnLeave(0.2, 1);
  };

  return { onEnterTitle, onLeaveTitle };
}
