"use client";

import React, { useState, useEffect } from "react";

export default function HeroSection() {
  const [timeLeft, setTimeLeft] = useState({
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const target = new Date("2026-04-07T00:00:00");
    const updateTimer = () => {
      const now = new Date();
      const diff = target.getTime() - now.getTime();
      if (diff <= 0) {
        setTimeLeft({ months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      const totalSeconds = Math.floor(diff / 1000);
      const seconds = totalSeconds % 60;
      const minutesTotal = Math.floor(totalSeconds / 60);
      const minutes = minutesTotal % 60;
      const hoursTotal = Math.floor(minutesTotal / 60);
      const hours = hoursTotal % 24;
      const daysTotal = Math.floor(hoursTotal / 24);
      // Approximate months using average month length (30.436875 days)
      const months = Math.floor(daysTotal / 30.436875);
      const days = Math.floor(daysTotal % 30.436875);
      setTimeLeft({ months, days, hours, minutes, seconds });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatNum = (num: number) => num.toString().padStart(2, "0");

  return (
    <section className="relative h-[100vh] overflow-hidden hero-bg rounded-bl-[20vh] rounded-br-[20vh]">
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-4">
        {/* Countdown Timer */}
        <div className="flex items-center gap-8">
          <div className="flex flex-col items-center">
            <span className="timer-number text-9xl font-bold text-white">
              {formatNum(timeLeft.months)}
            </span>
            <span className="text-white text-lg mt-4">months</span>
          </div>
          <span className="text-6xl text-white opacity-80">:</span>
          <div className="flex flex-col items-center">
            <span className="timer-number text-9xl font-bold text-white">
              {formatNum(timeLeft.days)}
            </span>
            <span className="text-white text-lg mt-4">days</span>
          </div>
          <span className="text-6xl text-white opacity-80">:</span>
          <div className="flex flex-col items-center">
            <span className="timer-number text-9xl font-bold text-white">
              {formatNum(timeLeft.hours)}
            </span>
            <span className="text-white text-lg mt-4">hours</span>
          </div>
          <span className="text-6xl text-white opacity-80">:</span>
          <div className="flex flex-col items-center">
            <span className="timer-number text-9xl font-bold text-white">
              {formatNum(timeLeft.minutes)}
            </span>
            <span className="text-white text-lg mt-4">minutes</span>
          </div>
          <span className="text-6xl text-white opacity-80">:</span>
          <div className="flex flex-col items-center">
            <span className="timer-number text-9xl font-bold text-white">
              {formatNum(timeLeft.seconds)}
            </span>
            <span className="text-white text-lg mt-4">seconds</span>
          </div>
        </div>
      </div>
    </section>
  );
}
