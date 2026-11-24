// import Sponsors from "@/app/sections/Sponsors";
import Hero from "@/app/sections/Hero";
import About from "@/app/sections/About";
import Clouds from "@/app/sections/Clouds";
import Prizes from "@/app/sections/Tracks";
import Stats from "@/app/sections/Stats";
import Faq from "@/app/sections/FAQ";
import Footer from "@/app/sections/Footer";
import Sponsors from "./sections/Sponsors";
import CityDrive from "@/app/sections/CityDrive";

export const dynamic = "force-dynamic";

export default async function Home() {
  return (
    <>
      <a
        id="mlh-trust-badge"
        style={{
          display: "block",
          maxWidth: "100px",
          minWidth: "60px",
          position: "fixed",
          left: "50px",
          top: 0,
          width: "10%",
          zIndex: 10000,
        }}
        href="https://mlh.io/na?utm_source=na-hackathon&utm_medium=TrustBadge&utm_campaign=2026-season&utm_content=white"
        target="_blank"
        rel="noreferrer"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://logged-assets.s3.amazonaws.com/trust-badge/2027/mlh-trust-badge-2027-white.svg"
          alt="Major League Hacking 2026 Hackathon Season"
          style={{ width: "100%" }}
        />
      </a>

      <CityDrive />
      {/* <Hero />
      <Clouds />
      <About />
      <Stats />
      <Sponsors />
      <Prizes />
      <Faq />
      <Footer />
      */}
    </>
  );
}
