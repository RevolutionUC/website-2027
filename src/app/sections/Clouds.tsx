"use client";

import Image from "next/image";
import gsap from "gsap";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";

gsap.registerPlugin(ScrollTrigger);

const GsapScrollTrigger = () => {
  const scrollRef = useRef<any>(null);

  useGSAP(
    () => {
      const boxes = gsap.utils.toArray(scrollRef.current.children);
      const isMobile = window.innerWidth < 640;
      const scrollMultiplier = isMobile ? 50 : 100;
      const scaleAmount = isMobile ? 1.2 : 1.5;

      boxes.forEach((box: any, index: number) => {
        const direction = index === 0 || index === 1 || index === 2 || index === 3 ? 1 : -1;

        gsap.to(box, {
          x: direction * scrollMultiplier * (index + 3),
          scale: scaleAmount,
          scrollTrigger: {
            trigger: box,
            start: "bottom bottom",
            end: "top 20%",
            scrub: true,
            //markers: true,
          },
          //ease: "power2.out",
          //markers: true,
        });
      });
    },
    { scope: scrollRef },
  );

  return (
    <main>
      <div
        id="clouds"
        className="section absolute top-[45%] left-0 right-0 h-screen z-0 overflow-visible "
      >
        <Image
          src="/cloud_final1.webp"
          alt="Cloud"
          width={400}
          height={225}
          priority
          className="absolute top-[-15%] left-[5%] opacity-80 w-[150px] sm:w-[250px] lg:w-[400px] h-auto"
          sizes="(max-width: 640px) 150px, (max-width: 1024px) 250px, 400px"
          data-speed="0.8"
        />
        <Image
          src="/cloud_final1.webp"
          alt="Cloud"
          width={800}
          height={450}
          priority
          className="absolute top-[30%] left-[-10%] opacity-70 w-[250px] sm:w-[400px] lg:w-[600px] h-auto"
          sizes="(max-width: 640px) 250px, (max-width: 1024px) 400px, 600px"
          data-speed="0.6"
        />
        <Image
          src="/cloud_final5.webp"
          alt="Cloud"
          width={800}
          height={450}
          priority
          className="absolute top-[10%] right-[-25%] opacity-75 w-[300px] sm:w-[500px] lg:w-[800px] h-auto"
          sizes="(max-width: 640px) 300px, (max-width: 1024px) 500px, 800px"
          data-speed="1.2"
        />
        <Image
          src="/cloud_final4.webp"
          alt="Cloud"
          width={800}
          height={400}
          priority
          className="absolute top-[50%] right-[5%] opacity-80 w-[150px] sm:w-[250px] lg:w-[400px] h-auto"
          sizes="(max-width: 640px) 150px, (max-width: 1024px) 250px, 400px"
          data-speed="0.9"
        />
        <Image
          src="/cloud_final3.webp"
          alt="Cloud"
          width={800}
          height={450}
          priority
          className="absolute top-[50%] left-[15%] opacity-65 w-[150px] sm:w-[250px] lg:w-[400px] h-auto"
          sizes="(max-width: 640px) 150px, (max-width: 1024px) 250px, 400px"
          data-speed="0.7"
        />
      </div>

      <div className="h-[20vh] sm:h-[70vh] w-full relative flex justify-center overflow-hidden" ref={scrollRef}>
        <Image
          src="/cloud_final1.webp"
          alt="Cloud"
          width={800}
          height={450}
          loading="lazy"
          className="scroll-box absolute top-0 left-[60%] w-[200px] sm:w-[400px] lg:w-[800px] h-auto"
          sizes="(max-width: 640px) 200px, (max-width: 1024px) 400px, 800px"
        />
        <Image
          src="/cloud_final2.webp"
          alt="Cloud"
          width={800}
          height={450}
          loading="lazy"
          className="scroll-box absolute top-30 left-[50%] w-[200px] sm:w-[400px] lg:w-[800px] h-auto"
          sizes="(max-width: 640px) 200px, (max-width: 1024px) 400px, 800px"
        />
        <Image
          src="/cloud_final1.webp"
          alt="Cloud"
          width={800}
          height={450}
          loading="lazy"
          className="scroll-box absolute top-0 left-[40%] w-[200px] sm:w-[400px] lg:w-[800px] h-auto"
          sizes="(max-width: 640px) 200px, (max-width: 1024px) 400px, 800px"
        />
        <Image
          src="/cloud_final5.webp"
          alt="Cloud"
          width={800}
          height={450}
          loading="lazy"
          className="scroll-box absolute top-0 left-[70%] w-[200px] sm:w-[400px] lg:w-[800px] h-auto"
          sizes="(max-width: 640px) 200px, (max-width: 1024px) 400px, 800px"
        />
        <Image
          src="/cloud_final4.webp"
          alt="Cloud"
          width={800}
          height={450}
          loading="lazy"
          className="scroll-box absolute top-0 right-[50%] w-[200px] sm:w-[400px] lg:w-[800px] h-auto"
          sizes="(max-width: 640px) 200px, (max-width: 1024px) 400px, 800px"
        />
        <Image
          src="/cloud_final1.webp"
          alt="Cloud"
          width={800}
          height={450}
          loading="lazy"
          className="scroll-box absolute top-20 right-[20%] w-[200px] sm:w-[400px] lg:w-[800px] h-auto"
          sizes="(max-width: 640px) 200px, (max-width: 1024px) 400px, 800px"
        />
        <Image
          src="/cloud_final4.webp"
          alt="Cloud"
          width={800}
          height={450}
          loading="lazy"
          className="scroll-box absolute top-10 right-[30%] w-[200px] sm:w-[400px] lg:w-[800px] h-auto"
          sizes="(max-width: 640px) 200px, (max-width: 1024px) 400px, 800px"
        />
        <Image
          src="/cloud_final5.webp"
          alt="Cloud"
          width={800}
          height={450}
          loading="lazy"
          className="scroll-box absolute top-0 right-[60%] w-[200px] sm:w-[400px] lg:w-[800px] h-auto"
          sizes="(max-width: 640px) 200px, (max-width: 1024px) 400px, 800px"
        />
      </div>
    </main>
  );
};

export default GsapScrollTrigger;
