import React, { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";

export default function Preloader({ setIsLoading }) {
  const textHello = [
    "• Hello",
    "• こんにちは",
    "• Bonjour",
    "• 你好",
    "• Halo",
    "• 안녕하세요",
    "• Saludos",
    "• مرحبًا",
    "• Grüße",
    "• Sugeng Rawuh",
    // "你好 (Nǐ hǎo)",
    // "안녕하세요 (Annyeonghaseyo)",
    // "مرحبًا (Marhaban)",
    // "こんにちは (Konnichiwa)",
  ];
  const preloaderRef = useRef();
  const preloader = document.querySelector(".preloader");
  const [TextIndex, setTextIndex] = useState(0);

  useLayoutEffect(() => {
    const tl = gsap.timeline();
    const delay = 0.225;

    const ctx = gsap.context(() => {
      textHello.forEach((text, i) => {
        tl.add(() => setTextIndex(i), i * delay);
      });

      tl.add(() => {
        setIsLoading(true);
        gsap.to(preloader, {
          onComplete: () => {
            preloaderRef.current .remove();
          },
        });
      });
    }, preloaderRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <div className="preloader" ref={preloaderRef}>
        {textHello[TextIndex]}
      </div>
    </>
  );
}
