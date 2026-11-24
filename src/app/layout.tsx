import type { Metadata } from "next";
import { IBM_Plex_Mono, Instrument_Sans } from "next/font/google";
import { ThemeProvider } from "@/app/components/theme-provider";
import { GsapRouteCleanupProvider } from "@/app/components/gsap-route-cleanup";
import ScrollSmootherWrapper from "@/app/components/ScrollSmoother";
import "./globals.css";
import "./sections/CityDrive.css";
import { NavigationBar } from "@/app/components/NavigationBar";

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-instrument-sans",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-ibm-plex-mono",
});

export const metadata: Metadata = {
  title: "RevolutionUC 2027",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Create an array of 8 items to map over
  const bgParts = Array.from({ length: 8 }, (_, i) => i + 1);

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${instrumentSans.className} ${ibmPlexMono.variable} antialiased`}>
        <NavigationBar />
        {/* Fixed background element for better performance */}
        {/* <div
          className="fixed inset-0 bg-linear-to-b from-[#228CF6] via-[#DDEEFF] to-[#EDF6FF]"
          aria-hidden="true"
        /> */}
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <GsapRouteCleanupProvider>
            <ScrollSmootherWrapper>
            <div
              className="relative flex min-h-screen flex-col
            "
            >
              <div
                className="fixed inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage: "url(/website-bg-no-grain.webp)",
                  transform: "translateZ(0)",
                  backfaceVisibility: "hidden",
                }}
                aria-hidden="true"
              />
              <main className="flex-1 relative z-10">{children}</main>
            </div>
          </ScrollSmootherWrapper>
          </GsapRouteCleanupProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}