"use client";

import React, { useEffect, useState } from "react";

interface StatProps {
  label: string;
  target: number;
  suffix?: string;
}

const AnimatedNumber = ({ target, suffix = "+" }: { target: number; suffix?: string }) => {
  const [count, setCount] = useState(0);
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    let start = 0;
    const duration = 3500; // ms
    const stepTime = 16; // ~60fps
    const totalSteps = duration / stepTime;
    const increment = target / totalSteps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        start = target;
        clearInterval(timer);
      }
      setCount(start);
      setDisplay(Math.floor(start).toLocaleString("en-IN") + suffix);
    }, stepTime);

    return () => clearInterval(timer);
  }, [target, suffix]);

  return (
    <div className="relative w-[180px] sm:w-[220px] md:w-[260px] h-[80px] sm:h-[90px] md:h-[100px] flex items-center justify-center">
      <span className="absolute text-5xl sm:text-6xl md:text-7xl font-extrabold text-orange-500 leading-none select-none">
        {display}
      </span>
    </div>
  );
};

const StatItem = ({ label, target, suffix }: StatProps) => (
  <div className="flex flex-col items-center justify-center text-center space-y-3">
    <AnimatedNumber target={target} suffix={suffix} />
    <p className="text-white text-lg font-semibold">{label}</p>
  </div>
);

export default function StatsSection() {
  return (
    <section className="w-full bg-gradient-to-b from-black via-neutral-950 to-black text-white py-24">
      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row justify-around items-center gap-12">
        <StatItem label="Social media reach" target={100000} />
        <StatItem label="Registrations" target={3000} />
        <StatItem label="Footfall" target={50000} />
      </div>
    </section>
  );
}
