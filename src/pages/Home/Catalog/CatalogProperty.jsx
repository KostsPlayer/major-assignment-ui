import { useRef } from "react";
import { useIsomorphicLayoutEffect } from "../../../component/Helper/useIsomorphicLayoutEffect";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
import { scaleOnEnter, scaleOnLeave } from "../../../component/Helper/CursorEffect";

export function CatalogTitle() {
  const catalogTitle = useRef();

  useIsomorphicLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power4.in" },
        scrollTrigger: {
          trigger: ".catalog-title-text",
          scrub: 1,
          start: "top bottom",
          end: "top bottom",
        },
      });
      tl.from(".catalog-title-text-0", {
        yPercent: 120,
        duration: 20,
        autoAlpha: 0,
      }).from(
        ".catalog-title-text-1",
        {
          yPercent: 120,
          duration: 20,
          autoAlpha: 0,
        },
        "<1"
      );
    }, catalogTitle);

    return () => ctx.revert();
  }, []);

  return { catalogTitle };
}

export function CatalogCursorTitle() {
  const onEnterTitle = () => {
    scaleOnEnter(3, 3);
  };
  const onLeaveTitle = () => {
    scaleOnLeave(0.2, 1);
  };

  return { onEnterTitle, onLeaveTitle };
}
