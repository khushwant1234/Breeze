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
      <ParallaxHero />

      {/* Main Content - positioned above hero with z-index */}
      <div className="relative z-10 bg-black">
        <StatsSection />
        <Sponsorship />
        <AfterMovie />
        <Gallery />
      </div>
    </main>
  );
}
