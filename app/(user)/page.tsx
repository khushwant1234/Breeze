"use client";
import React from "react";

import ParallaxHero from "../../components/landing-page/ParallaxHero";
import Sponsorship from "../../components/landing-page/sponsorship";
import AfterMovie from "../../components/landing-page/aftermovie";
import Gallery from "../../components/landing-page/gallery";
import "../globals.css";
import StatsSection from "../../components/landing-page/StatsSection";

export default function Home(): React.ReactElement {
  return (
    <main className="min-h-screen bg-black text-white relative">
      {/* Hero Section with Parallax and Timer */}
      <div className="relative z-0">
        <ParallaxHero />
      </div>

      {/* Main Content - positioned to overlap hero */}
      <div className="relative z-10 -mt-12 md:-mt-20">
        <div className="bg-black relative overflow-hidden">
          {/* White gradient from left edge - stats section only */}
          <div className="absolute left-0 top-0 bottom-0 w-32 md:w-48 bg-gradient-to-r from-white/20 to-transparent pointer-events-none z-10" />
          {/* White gradient from right edge - stats section only */}
          <div className="absolute right-0 top-0 bottom-0 w-32 md:w-48 bg-gradient-to-l from-white/20 to-transparent pointer-events-none z-10" />
          <StatsSection />
        </div>

        {/* Wrapper with white gradient behind rounded sponsorship corners */}
        <div className="relative bg-black">
          {/* White gradient from left edge - behind rounded corners */}
          <div className="absolute left-0 top-0 h-24 w-32 md:w-48 bg-gradient-to-r from-white/20 to-transparent pointer-events-none z-0" />
          {/* White gradient from right edge - behind rounded corners */}
          <div className="absolute right-0 top-0 h-24 w-32 md:w-48 bg-gradient-to-l from-white/20 to-transparent pointer-events-none z-0" />
          <div className="relative z-10">
            <Sponsorship />
          </div>
        </div>

        <AfterMovie />
        <Gallery />
      </div>
    </main>
  );
}
