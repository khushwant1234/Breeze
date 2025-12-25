"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";

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
  const [scrollY, setScrollY] = useState(0);
  const [isTimerInNavbar, setIsTimerInNavbar] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsClient(true);

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);

      // Check if hero section is scrolled past (trigger 300px above the bottom of hero)
      if (heroRef.current) {
        const heroBottom = heroRef.current.offsetHeight - 300;
        setIsTimerInNavbar(window.scrollY > heroBottom);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const time = isClient ? timeLeft : calculateTimeLeft(targetDate);

  // Timer component that can be rendered in both positions
  const Timer = ({ compact = false }: { compact?: boolean }) => (
    <div
      className={`flex items-center font-audiowide text-white ${
        compact ? "gap-2 text-sm" : "gap-4 text-4xl md:text-6xl"
      }`}
    >
      <div className="flex flex-col items-center">
        <span className={compact ? "font-bold" : "font-extrabold"}>
          {String(time.totalDays).padStart(2, "0")}
        </span>
        {!compact && <span className="text-base md:text-xl mt-1">Days</span>}
      </div>

      <span className={compact ? "font-bold" : "text-2xl md:text-4xl"}>:</span>

      <div className="flex flex-col items-center">
        <span className={compact ? "font-bold" : "font-extrabold"}>
          {String(time.hours).padStart(2, "0")}
        </span>
        {!compact && <span className="text-base md:text-xl mt-1">Hours</span>}
      </div>

      <span className={compact ? "font-bold" : "text-2xl md:text-4xl"}>:</span>

      <div className="flex flex-col items-center">
        <span className={compact ? "font-bold" : "font-extrabold"}>
          {String(time.minutes).padStart(2, "0")}
        </span>
        {!compact && <span className="text-base md:text-xl mt-1">Min</span>}
      </div>

      <span className={compact ? "font-bold" : "text-2xl md:text-4xl"}>:</span>

      <div className="flex flex-col items-center">
        <span className={compact ? "font-bold" : "font-extrabold"}>
          {String(time.seconds).padStart(2, "0")}
        </span>
        {!compact && <span className="text-base md:text-xl mt-1">Sec</span>}
      </div>
    </div>
  );

  return (
    <>
      {/* Hero Section with Parallax */}
      <div
        ref={heroRef}
        className="relative w-full h-[150vh] overflow-hidden z-0"
      >
        {/* Parallax Background Image */}
        <div
          className="absolute inset-0 w-full h-[180%]"
          style={{
            transform: `translateY(${scrollY * 0.5}px)`,
          }}
        >
          <Image
            src="/image/hero-parallax.jpeg"
            alt="Breeze Hero"
            fill
            className="object-cover object-center"
            priority
          />
          {/* Dark overlay for better text visibility */}
          <div className="absolute inset-0 bg-black/40" />
        </div>

        {/* Fixed Timer Container - stays fixed in center until near bottom of hero */}
        <div
          className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center justify-center transition-all duration-500 pointer-events-none ${
            isTimerInNavbar ? "opacity-0 scale-75" : "opacity-100 scale-100"
          }`}
        >
          {/* Event Title */}
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 font-pandora tracking-wider drop-shadow-lg">
            BREEZE 2026
          </h1>
          <p className="text-lg md:text-2xl text-white/90 mb-8 tracking-widest uppercase">
            Coming Soon
          </p>

          {/* Big Timer */}
          <div className="bg-black/30 backdrop-blur-sm px-8 py-6 rounded-2xl">
            <Timer />
          </div>
        </div>

        {/* Gradient fade at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent" />
      </div>
    </>
  );
}
