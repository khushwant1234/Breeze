"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

import ParallaxHero from "../../components/landing-page/ParallaxHero";
import Sponsorship from "../../components/landing-page/sponsorship";
import AfterMovie from "../../components/landing-page/aftermovie";
import Gallery from "../../components/landing-page/gallery";
import "../globals.css";
import StatsSection from "../../components/landing-page/StatsSection";

export default function Home(): React.ReactElement {
  const router = useRouter();

  useEffect(() => {
    let hasNavigated = false;

    const handleScroll = () => {
      const scrolledToBottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 2;

      // if (scrolledToBottom) {
      //   router.push("/loading");
      // }
      const alreadyLoaded = sessionStorage.getItem("hasSeenLoading");

      if (scrolledToBottom && !hasNavigated && !alreadyLoaded) {
        hasNavigated = true;
        sessionStorage.setItem("hasSeenLoading", "true");
        router.push("/loading");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [router]);

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
