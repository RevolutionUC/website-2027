"use client";

import { useEffect, useRef } from "react";
import AboutSign from "./city-drive/AboutSign";
import CityDriveHero from "./city-drive/CityDriveHero";
import DriveOverlay from "./city-drive/DriveOverlay";
import FaqSign from "./city-drive/FaqSign";
import ScheduleSign from "./city-drive/ScheduleSign";
import SponsorsSign from "./city-drive/SponsorsSign";
import TracksSign from "./city-drive/TracksSign";

export default function CityDrive() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);



  useEffect(() => {
    const canvas = canvasRef.current;
    const track = trackRef.current;
    const stage = stageRef.current;

    if (!canvas || !track || !stage) return;


    const context = canvas.getContext("2d");
    if (!context) {
        throw new Error("Could not creare the CityDrive canvas context.");
    }

    const resizeCanvas = () => {
        const rect = canvas.getBoundingClientRect();
        const pixelRatio = window.devicePixelRatio || 1;

        canvas.width = Math.round(rect.width * pixelRatio);
        canvas.height = Math.round(rect.height * pixelRatio);
        context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    return () => {
        window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <section id="city-drive" className="city-drive">
      <div ref={trackRef} id="track">
        <div ref={stageRef} id="stage">
          <canvas id="skyband" aria-hidden="true" />
          <canvas
            ref={canvasRef}
            id="cv"
            aria-label="Hand-painted Cincinnati street at sunset"
          />
          <div id="blend" aria-hidden="true" />

          <ScheduleSign />
          <SponsorsSign />
          <TracksSign />
          <FaqSign />
          <AboutSign />
          <CityDriveHero />
          <DriveOverlay />
        </div>
      </div>
    </section>
  );
}