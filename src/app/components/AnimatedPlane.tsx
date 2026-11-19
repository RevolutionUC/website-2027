"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

export default function AnimatedPlane() {
  const planeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!planeRef.current) return;

    // No pin: pin moves DOM nodes and causes "removeChild" errors when
    // navigating away (e.g. to /schedule) because React unmounts the node
    // ScrollTrigger still references.
    const tween = gsap.to(planeRef.current, {
      x: -300,
      y: -200,
      scale: 1.3,
      scrollTrigger: {
        trigger: "#hero",
        start: "top top",
        end: "+=500",
        scrub: 1,
      },
    });

    return () => {
      // Kill only this component's ScrollTrigger before unmount to avoid
      // "removeChild" errors when the pinned node is no longer in the DOM
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-y-visible pointer-events-none z-30">
      <div
        ref={planeRef}
        className="absolute top-[65%] sm:top-[40%] right-[-10%] w-50 h-32 sm:w-40 sm:h-32 md:w-70 md:h-50 lg:w-200 lg:h-72"
      >
        <Image
          src="/plane.webp"
          alt=""
          fill
          sizes="30vw"
          className="object-contain"
          priority
        />
      </div>
    </div>
  );
}
