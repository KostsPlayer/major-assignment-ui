import gsap from "gsap";

export function moveMagnet(e) {
  const magnetButton = e.currentTarget;
  const bounding = magnetButton.getBoundingClientRect();
  const speed = 35;

  gsap.to(magnetButton, 1, {
    x: ((e.clientX - bounding.left) / magnetButton.offsetWidth - 0.5) * speed,
    y: ((e.clientY - bounding.top) / magnetButton.offsetHeight - 0.5) * speed,
    ease: "power4.out",
  });
}

export function outMagnet(e) {
  gsap.to(e.currentTarget, 1, {
    x: 0,
    y: 0,
    ease: "power4.out",
  });
}
