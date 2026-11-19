"use client";

import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import gsap from "gsap";
import Image from "next/image";
import AnimatedPlane from "../components/AnimatedPlane";

gsap.registerPlugin(ScrollToPlugin);

export default function HeroSection() {
  return (
    <div
      id="hero"
      className="section w-full h-screen flex items-center px-4 sm:px-6 lg:px-8 relative z-50"
    >
      {/* Plane */}
      <AnimatedPlane />

      {/* Clouds */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-[0%] sm:top-[-5%] right-[70%] sm:right-[80%] w-[300px] sm:w-[400px] lg:w-[500px] h-40 sm:h-56 lg:h-64 opacity-70"
          data-speed="0.9"
        >
          <Image
            src="/cloud_final1.webp"
            alt=""
            fill
            className="object-contain"
            sizes="30vw"
          />
        </div>

        <div
          className="absolute top-[10%] left-[8%] w-[150px] sm:w-[175px] lg:w-[200px] h-36 sm:h-54 lg:h-72 opacity-60"
          data-speed="0.8"
        >
          <Image
            src="/cloud_final3.webp"
            alt=""
            fill
            className="object-contain"
            sizes="30vw"
          />
        </div>

        <div
          className="absolute top-[-5%] sm:top-[-10%] left-[25%] w-20 sm:w-[115px] lg:w-[150px] h-36 sm:h-54 lg:h-72 opacity-60 scale-x-[-1]"
          data-speed="0.9"
        >
          <Image
            src="/cloud_final3.webp"
            alt=""
            fill
            className="object-contain"
            sizes="30vw"
          />
        </div>

        <div
          className="absolute top-[5%] sm:top-[-2%] left-[60%] w-[150px] sm:w-[175px] lg:w-[200px] h-36 sm:h-54 lg:h-72 opacity-60"
          data-speed="0.95"
        >
          <Image
            src="/cloud_final3.webp"
            alt=""
            fill
            className="object-contain"
            sizes="30vw"
          />
        </div>

        <div
          className="absolute top-[10%] sm:top-[7%] left-[70%] w-[150px] sm:w-[200px] lg:w-[250px] h-36 sm:h-54 lg:h-72 opacity-50"
          data-speed="0.95"
        >
          <Image
            src="/cloud_final2.webp?hero"
            alt=""
            fill
            className="object-contain"
            sizes="30vw"
            loading="eager"
          />
        </div>

        <div
          className="absolute bottom-[-10%] sm:bottom-[-25%] left-[5%] w-[300px] sm:w-[550px] lg:w-[800px] h-40 sm:h-65 lg:h-90 opacity-100"
          data-speed="0.8"
        >
          <Image
            src="/cloud_final1.webp?hero-lcp"
            alt=""
            fill
            className="object-contain"
            sizes="30vw"
            loading="eager"
          />
        </div>

        <div
          className="absolute bottom-[-5%] sm:bottom-[-20%] left-[-25%] w-[350px] sm:w-[625px] lg:w-[900px] h-40 sm:h-61 lg:h-82 opacity-100"
          data-speed="0.85"
        >
          <Image
            src="/cloud_final2.webp?hero"
            alt=""
            fill
            className="object-contain"
            sizes="30vw"
            loading="eager"
          />
        </div>

        <div
          className="absolute bottom-[10%] sm:bottom-[0%] left-[-35%] w-[350px] sm:w-[625px] lg:w-[900px] h-40 sm:h-61 lg:h-82 opacity-100"
          data-speed="0.95"
        >
          <Image
            src="/cloud_final4.webp"
            alt=""
            fill
            className="object-contain"
            sizes="30vw"
          />
        </div>

        <div
          className="absolute bottom-[12%] sm:bottom-[-3%] left-[15%] w-[150px] sm:w-[225px] lg:w-[300px] h-40 sm:h-65 lg:h-90 opacity-60"
          data-speed="0.8"
        >
          <Image
            src="/cloud_final1.webp"
            alt=""
            fill
            className="object-contain"
            sizes="30vw"
          />
        </div>

        <div
          className="absolute bottom-[15%] sm:bottom-[-4%] right-[-5%] sm:right-[5%] w-[250px] sm:w-[400px] lg:w-[550px] h-40 sm:h-65 lg:h-90 opacity-60"
          data-speed="0.9"
        >
          <Image
            src="/cloud_final2.webp?hero"
            alt=""
            fill
            className="object-contain"
            sizes="30vw"
            loading="eager"
          />
        </div>

        <div
          className="absolute bottom-[6%] sm:bottom-[-15%] right-[-25%] w-[350px] sm:w-[625px] lg:w-[900px] h-40 sm:h-65 lg:h-90 opacity-100"
          data-speed="0.9"
        >
          <Image
            src="/cloud_final4.webp"
            alt=""
            fill
            className="object-contain"
            sizes="30vw"
          />
        </div>
        <div
          className="absolute top-[70%] right-[60%] w-[40vh] h-64 opacity-70"
          data-speed="0.8"
        > 
          <Image
            src="/cloud_final1.webp"
            alt=""
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 500px"
            loading="lazy"
          />
        </div>
      </div>

      {/* Content */}
      <div className="w-full max-w-6xl mx-auto relative pointer-events-none pb-8 sm:pb-14 lg:pb-16 z-40">
        <div className="max-w-2xl mx-auto sm:mx-0">
          <h1 className="underline text-[#151477] underline-offset-4 decoration-[#19E363] text-5xl sm:text-6xl lg:text-8xl font-semibold text-center sm:text-left">
            RevolutionUC
          </h1>
          <p className="py-2 sm:py-3 text-2xl sm:text-2xl lg:text-3xl text-[#151477] font-medium italic text-center sm:text-left">
            Spring 2027...
          </p>
          {/*<p className="py-1 sm:py-2 text-2xl sm:text-2xl lg:text-3xl text-[#228CF6] text-center sm:text-left">
            Build. Learn. Grow.
          </p>*/}
          {/* Forms */}
          <div className="flex flex-col md:flex-row justify-center sm:justify-start items-center gap-3 md:gap-4 pt-4 md:w-full max-w-4xl pointer-events-auto mx-auto sm:mx-0">
            <a
              href="/sponsor-interest"
              className="w-auto px-4 py-2.5 text-center text-sm md:text-base font-semibold uppercase whitespace-nowrap rounded-full text-[#EDF6FF] bg-[#151477] border-[#19E363] border-2 transition-all duration-300 hover:bg-[#19E363] hover:text-white hover:scale-[1.02] active:scale-[0.98] shadow-lg"
            >
              SPONSOR INTEREST FORM
            </a>
            <a
              href="/judge-mentor-interest"
              className="w-auto px-4 py-2.5 text-center text-sm md:text-base font-semibold uppercase whitespace-nowrap rounded-full text-[#EDF6FF] bg-[#151477] border-[#19E363] border-2 transition-all duration-300 hover:bg-[#19E363] hover:text-white hover:scale-[1.02] active:scale-[0.98] shadow-lg"
            >
              JUDGE/MENTOR INTEREST FORM
            </a>
            <a
              href="/interest"
              className="w-auto px-4 py-2.5 text-center text-sm md:text-base font-semibold uppercase whitespace-nowrap rounded-full text-[#EDF6FF] bg-[#151477] border-[#19E363] border-2 transition-all duration-300 hover:bg-[#19E363] hover:text-white hover:scale-[1.02] active:scale-[0.98] shadow-lg"
            >
              HACKER REGISTRATION FORM
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
