"use client";

import React, { useEffect, useState, useRef } from "react";

interface TimeLeft {
  totalDays: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calculateTimeLeft(targetDate: string): TimeLeft {
  const difference = +new Date(targetDate) - +new Date();
  let timeLeft: TimeLeft = { totalDays: 0, hours: 0, minutes: 0, seconds: 0 };

  if (difference > 0) {
    const totalSeconds = Math.floor(difference / 1000);
    const totalMinutes = Math.floor(totalSeconds / 60);
    const totalHours = Math.floor(totalMinutes / 60);
    const totalDays = Math.floor(totalHours / 24);

    timeLeft = {
      totalDays: totalDays,
      hours: totalHours % 24,
      minutes: totalMinutes % 60,
      seconds: totalSeconds % 60,
    };
  }
  return timeLeft;
}

export default function ParallaxHero() {
  const targetDate = "2026-02-19T23:59:59";
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(
    calculateTimeLeft(targetDate)
  );
  const [isClient, setIsClient] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setIsClient(true);

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Ensure video plays after loading
    if (videoRef.current) {
      videoRef.current.play().catch((error) => {
        console.log("Video autoplay failed:", error);
      });
    }
  }, []);

  const time = isClient ? timeLeft : calculateTimeLeft(targetDate);

  // Timer component
  const Timer = () => (
    <div className="flex items-center font-audiowide text-white gap-3 md:gap-6">
      <div className="flex flex-col items-center">
        <span className="font-extrabold text-3xl md:text-5xl lg:text-7xl drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]">
          {String(time.totalDays).padStart(2, "0")}
        </span>
        <span className="text-xs md:text-lg lg:text-xl mt-1 tracking-wider">
          Days
        </span>
      </div>

      <span className="text-2xl md:text-4xl lg:text-5xl font-bold opacity-70">
        :
      </span>

      <div className="flex flex-col items-center">
        <span className="font-extrabold text-3xl md:text-5xl lg:text-7xl drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]">
          {String(time.hours).padStart(2, "0")}
        </span>
        <span className="text-xs md:text-lg lg:text-xl mt-1 tracking-wider">
          Hours
        </span>
      </div>

      <span className="text-2xl md:text-4xl lg:text-5xl font-bold opacity-70">
        :
      </span>

      <div className="flex flex-col items-center">
        <span className="font-extrabold text-3xl md:text-5xl lg:text-7xl drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]">
          {String(time.minutes).padStart(2, "0")}
        </span>
        <span className="text-xs md:text-lg lg:text-xl mt-1 tracking-wider">
          Min
        </span>
      </div>

      <span className="text-2xl md:text-4xl lg:text-5xl font-bold opacity-70">
        :
      </span>

      <div className="flex flex-col items-center">
        <span className="font-extrabold text-3xl md:text-5xl lg:text-7xl drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]">
          {String(time.seconds).padStart(2, "0")}
        </span>
        <span className="text-xs md:text-lg lg:text-xl mt-1 tracking-wider">
          Sec
        </span>
      </div>
    </div>
  );

  return (
    <div className="relative w-full h-screen overflow-hidden bg-purple-900">
      {/* Fallback gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 z-0" />

      {/* Video Background */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover z-[1]"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        onLoadedData={() => setIsVideoLoaded(true)}
        onError={(e) => console.log("Video error:", e)}
      >
        <source src="/hero-video-high-resolution.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Gradient Overlays for better text visibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 z-[2]" />

      {/* Animated Content Container */}
      <div className="relative z-[10] h-full flex flex-col items-center justify-center px-4">
        {/* Event Title with Animation */}
        {/* <div className="text-center mb-8 md:mb-12">
          <h1
            className="text-6xl md:text-8xl lg:text-9xl font-bold text-white mb-4 tracking-wider drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]"
            style={{ color: "white" }}
          >
            BREEZE 2026
          </h1>
          <div className="flex items-center justify-center gap-3 md:gap-4">
            <div className="h-[2px] w-12 md:w-20 bg-gradient-to-r from-transparent to-white/50" />
            <p className="text-base md:text-xl lg:text-2xl text-white/90 tracking-[0.3em] uppercase font-light">
              Coming Soon
            </p>
            <div className="h-[2px] w-12 md:w-20 bg-gradient-to-l from-transparent to-white/50" />
          </div>
        </div> */}

        {/* Timer with Glass Effect */}
        <div className="bg-black/20 backdrop-blur-md px-6 md:px-10 lg:px-12 py-6 md:py-8 lg:py-10 rounded-2xl border border-white/10 shadow-2xl">
          <Timer />
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2">
          <div className="flex flex-col items-center gap-2 animate-bounce">
            <span className="text-white/60 text-sm tracking-widest uppercase">
              Scroll
            </span>
            <svg
              className="w-6 h-6 text-white/60"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
          </div>
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none z-[3]" />
    </div>
  );
}
