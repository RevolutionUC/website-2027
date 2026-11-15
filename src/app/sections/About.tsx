"use client";

import SplitText from "@/app/effects/SplitText";
import Image from "next/image";


export default function About() {
  return (
    <div 
      id="about" 
      className="section w-full min-h-screen lg:h-screen relative overflow-hidden flex flex-col lg:block "
    >
      {/* Background clouds */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none hidden lg:block">
        <div className="absolute top-[1vh] right-[75vw] w-[20vw] min-w-[150px] aspect-video opacity-70">
          <Image src="/cloud_final4.webp" alt="" fill sizes="20vw" className="object-contain" />
        </div>
        <div className="absolute top-[2vh] left-[5vw] w-[35vw] min-w-[300px] aspect-video opacity-30">
          <Image src="/cloud_final1.webp" alt="" fill sizes="35vw" className="object-contain" />
        </div>
        <div className="absolute top-[5vh] right-[2vw] w-[10vw] min-w-[100px] aspect-video opacity-60">
          <Image src="/cloud_final3.webp" alt="" fill sizes="10vw" className="object-contain" />
        </div>
      </div>

      {/* Plane */}
      <div className="relative lg:absolute lg:left-0 lg:top-[50%] lg:-translate-y-1/2 w-full lg:w-[45vw] flex justify-center lg:block z-10 pt-12 lg:pt-0">
        <div className="w-[70vw] sm:w-[50vw] lg:w-full max-w-[700px]">
          <Image
            src="/landing-plane.webp"
            alt="Landing Plane"
            width={1366}
            height={768}
            className="w-full h-auto"
            priority
          />
        </div>
      </div>

      {/* Content*/}
      <div className="relative z-20 w-full flex items-start justify-center lg:justify-end pb-5 lg:pt-[10vh] px-6 sm:px-12 lg:px-8">
        <div className="max-w-2xl lg:mr-[10vw] text-center lg:text-left">
          <SplitText
            text="About RevolutionUC"
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[#151477]"
            delay={50}
            duration={0.6}
            ease="power3.out"
            splitType="chars"
            from={{ opacity: 0, y: 40 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.1}
            textAlign="center"
          />

          <SplitText
            text="RevolutionUC is a 24-hour in-person student hackathon at the University of Cincinnati that is organized by ACM@UC. We invite you to join 300+ motivated students for an awesome weekend of code, community, and self-improvement! You don't have to have to be a computer science major or engineering student to attend. It's a learning experience for students of all skill levels!"
            className="text-base font-sans text-[#151477] sm:text-lg leading-relaxed pt-8 lg:pt-12"
            delay={30}
            duration={0.5}
            ease="power3.out"
            splitType="words"
            from={{ opacity: 0, y: 20 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.1}
            textAlign="center"
          />
        </div>
      </div>

      {/* Panda*/}
      <div className="relative lg:absolute lg:right-[5vw] lg:bottom-[12vh] w-full lg:w-[25vw] flex justify-center lg:block z-10 pb-12 lg:pb-0">
        {/* Panda */}
        <div className="relative w-[55vw] sm:w-[35vw] lg:w-full max-w-[500px]">
          <Image
            src="/waving-panda.webp"
            alt="Waving Panda"
            width={512}
            height={512}
            className="w-full h-auto object-contain relative z-20"
          />
          
          {/* cloud */}
          <div className="absolute bottom-[-55%] sm:bottom-[-15%] lg:bottom-[-50%] left-[50%] -translate-x-[50%] w-[120%] sm:w-[140%] lg:w-[160%] h-auto z-10">
            <Image
              src="/cloud_final2.webp"
              alt=""
              width={900}
              height={328}
              className="w-full h-auto object-contain"
            />
          </div>
        </div>
      </div>

      <div
        className="hidden lg:block absolute top-[50%] sm:bottom-[-15%] left-[-20%] w-[350px] sm:w-[625px] lg:w-[900px] h-40 sm:h-65 lg:h-100 opacity-100"
      >
        <Image
          src="/cloud_final4.webp"
          alt=""
          fill
          sizes="900px"
          className="object-contain h-auto scale-x-[-1] rotate-10"
        />
      </div>
      
      
    </div>
  );
}
