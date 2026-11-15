import SplitText from "@/app/effects/SplitText";
import Image from "next/image";

const trackData = [
  {
    title: "Most Technically Impressive",
    description: "Celebrates exceptional technical innovation, complexity, and engineering skill.",
  },
  {
    title: "Best Business Plan",
    description: "Honors the most feasible, scalable, and market-ready business strategy.",
  },
  {
    title: "Best Social Impact",
    description:
      "Rewards solutions that address pressing social, environmental, or humanitarian challenges.",
  },
  {
    title: "Best Use of AR",
    description:
      "Recognizes the most creative, technically sound, and impactful use of augmented reality.",
  },
  {
    title: "People's Choice",
    description:
      "Decided by participant votes to highlight the most popular project among attendees.",
  },
  {
    title: "Surprise / Super Secret track",
    description: "Shhhh...",
  },
];
export default function Tracks() {
  return (
    <div id="tracks" className="section w-full min-h-screen relative py-20 px-4 sm:px-6 lg:px-8">
      {/* Background decorative elements */}
      <Image
        src="/white-shirt.webp"
        alt=""
        width={800}
        height={800}
        className="absolute top-[15%] right-[-5%] rotate-20 w-[250px] sm:w-[400px] lg:w-[600px] h-auto"
        aria-hidden="true"
        data-speed="0.9"
      />
      <Image
        src="/sock.webp"
        alt=""
        width={700}
        height={700}
        className="absolute top-[15%] right-[-10%] scale-x-[-1] w-[200px] sm:w-[350px] lg:w-[500px] h-auto"
        aria-hidden="true"
        data-speed="1.1"
      />
      <Image
        src="/sock.webp"
        alt=""
        width={700}
        height={700}
        className="absolute top-[30%] right-[-15%] scale-x-[-1] w-[200px] sm:w-[350px] lg:w-[500px] h-auto"
        aria-hidden="true"
        data-speed="1.1"
      />
      <Image
        src="/shirt.webp"
        alt=""
        width={900}
        height={900}
        className="absolute bottom-[-30%] left-[-26%] rotate-[-20deg] w-[300px] sm:w-[500px] lg:w-[700px] h-auto sm:"
        aria-hidden="true"
        data-speed="0.8"
      />

      <Image
        src="/pants.webp"
        alt=""
        width={700}
        height={700}
        className="absolute bottom-[-5%] left-[-10%] rotate-12 w-[200px] sm:w-[350px] lg:w-[500px] h-auto"
        aria-hidden="true"
        data-speed="0.75"
      />

      <Image
        src="/boarding_pass.webp"
        alt=""
        width={510}
        height={330}
        className="absolute bottom-[-7%] left-[16%] rotate-15 w-[100px] sm:w-[180px] lg:w-[280px] h-auto"
        aria-hidden="true"
        data-speed="0.9"
      />

      {/* Content */}
      <div className="relative z-20 w-full max-w-7xl mx-auto">
        <div className="mt-16 mb-5 sm:mb-16 overflow-visible">
          <SplitText
            text="Previous Tracks"
            className="text-[#151477] text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight overflow-visible"
            delay={50}
            duration={0.6}
            ease="power3.out"
            splitType="chars"
            from={{ opacity: 0, y: 40 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.1}
            rootMargin="-100px"
            textAlign="center"
          />
        </div>

        {/* Track cards */}
        <div className="space-y-4 sm:space-y-6 max-w-7xl mx-auto">
          {/* First row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-4xl">
            {trackData.slice(0, 2).map((track, index) => (
              <div
                key={index}
                className="bg-white p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow duration-300 group"
              >
                <h3 className="text-xl sm:text-2xl font-bold text-[#151477] mb-2 sm:mb-3 relative inline-block">
                  {track.title}
                  <span className="absolute bottom-0 left-0 w-0 h-1 bg-[#19E363] transition-all duration-300 group-hover:w-full" />
                </h3>
                <p className="text-[#151477] text-base leading-relaxed">{track.description}</p>
              </div>
            ))}
          </div>

          {/* Second row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto">
            {trackData.slice(2, 4).map((track, index) => (
              <div
                key={index + 2}
                className="bg-white p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow duration-300 group"
              >
                <h3 className="text-xl sm:text-2xl font-bold text-[#151477] mb-2 sm:mb-3 relative inline-block">
                  {track.title}
                  <span className="absolute bottom-0 left-0 w-0 h-1 bg-[#19E363] transition-all duration-300 group-hover:w-full" />
                </h3>
                <p className="text-[#151477] text-base leading-relaxed">{track.description}</p>
              </div>
            ))}
          </div>

          {/* Third row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-4xl sm:ml-auto">
            {trackData.slice(4, 6).map((track, index) => (
              <div
                key={index + 4}
                className="bg-white p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow duration-300 group"
              >
                <h3 className="text-xl sm:text-2xl font-bold text-[#151477] mb-2 sm:mb-3 relative inline-block">
                  {track.title}
                  <span className="absolute bottom-0 left-0 w-0 h-1 bg-[#19E363] transition-all duration-300 group-hover:w-full" />
                </h3>
                <p className="text-[#151477] text-base leading-relaxed">{track.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
