"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";

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

// Loading screen component with progress bar and vertical split animation
const LoadingScreen = ({
  isExiting,
  isVideoLoaded,
  onLoadingComplete,
}: {
  isExiting: boolean;
  isVideoLoaded: boolean;
  onLoadingComplete: () => void;
}) => {
  const [progress, setProgress] = useState(0);
  const [canComplete, setCanComplete] = useState(false);
  const minLoadTime = 2000; // 2 seconds minimum
  const progressRef = useRef<number>(0);

  // Animate progress to 90% over 2 seconds
  useEffect(() => {
    const startTime = Date.now();
    let animationId: number;

    const animateProgress = () => {
      const elapsed = Date.now() - startTime;
      const t = Math.min(elapsed / minLoadTime, 1); // normalized time 0-1
      // Ease-in (accelerating): use t^2 for quadratic acceleration
      const easedT = t * t;
      const targetProgress = easedT * 90;
      progressRef.current = targetProgress;
      setProgress(targetProgress);

      if (elapsed >= minLoadTime) {
        setCanComplete(true);
      } else {
        animationId = requestAnimationFrame(animateProgress);
      }
    };

    animationId = requestAnimationFrame(animateProgress);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);

  // Complete to 100% when both conditions met
  useEffect(() => {
    if (canComplete && isVideoLoaded) {
      // Animate from current progress to 100%
      const start = progressRef.current;
      const startTime = Date.now();
      const duration = 300;

      const animateToComplete = () => {
        const elapsed = Date.now() - startTime;
        const t = Math.min(elapsed / duration, 1);
        const currentProgress = start + (100 - start) * t;
        setProgress(currentProgress);

        if (t < 1) {
          requestAnimationFrame(animateToComplete);
        } else {
          setTimeout(onLoadingComplete, 200);
        }
      };

      requestAnimationFrame(animateToComplete);
    }
  }, [canComplete, isVideoLoaded, onLoadingComplete]);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Top half */}
      <div
        className="absolute top-0 left-0 right-0 h-1/2 flex items-end justify-center z-10"
        style={{
          backgroundColor: "#8200C1",
          transform: isExiting ? "translateY(-100%)" : "translateY(0)",
          transition: "transform 0.8s ease-in-out",
        }}
      >
        {/* Progress bar on bottom edge of top half (visible when not exiting) */}
        {!isExiting && (
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-80 md:w-96 z-20">
            {/* Border container */}
            <div className="border-2 border-white p-[4px] rounded-sm">
              {/* Inner track with gap */}
              <div className="h-4 md:h-5 bg-transparent rounded-[2px] overflow-hidden">
                {/* Progress fill */}
                <div
                  className="h-full bg-white rounded-[1px]"
                  style={{
                    width: `${progress}%`,
                    transition: "width 50ms linear",
                  }}
                />
              </div>
            </div>
            {/* Percentage text */}
            <p className="text-white text-center text-sm md:text-base mt-3 font-medium">
              {Math.round(progress)}%
            </p>
          </div>
        )}
      </div>

      {/* Bottom half */}
      <div
        className="absolute bottom-0 left-0 right-0 h-1/2"
        style={{
          backgroundColor: "#8200C1",
          transform: isExiting ? "translateY(100%)" : "translateY(0)",
          transition: "transform 0.8s ease-in-out",
        }}
      />
    </div>
  );
};


export default function ParallaxHero() {
  const targetDate = "2026-02-19T23:59:59";
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(
    calculateTimeLeft(targetDate)
  );
  const [isClient, setIsClient] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [showLoading, setShowLoading] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setIsClient(true);

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  // Optimized video loading - defer until idle
  useEffect(() => {
    const loadVideo = () => {
      if (videoRef.current) {
        // Set source and load when browser is idle
        videoRef.current.load();
        videoRef.current.play().catch((error) => {
          console.log("Video autoplay failed:", error);
        });
      }
    };

    // Use requestIdleCallback for non-blocking video load
    if ("requestIdleCallback" in window) {
      (window as any).requestIdleCallback(loadVideo, { timeout: 2000 });
    } else {
      // Fallback for Safari
      setTimeout(loadVideo, 100);
    }
  }, []);

  // Handle video loaded state
  const handleVideoReady = useCallback(() => {
    setIsVideoLoaded(true);
  }, []);

  // Callback when loading screen progress completes
  const handleLoadingComplete = useCallback(() => {
    setIsExiting(true);
    // Wait for exit animation to complete (0.8s animation + 100ms buffer)
    setTimeout(() => {
      setShowLoading(false);
    }, 900);
  }, []);

  // Fallback: Force video loaded after 10 seconds
  useEffect(() => {
    const fallbackTimer = setTimeout(() => {
      setIsVideoLoaded(true);
    }, 10000);

    return () => clearTimeout(fallbackTimer);
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
    <div
      className="relative w-full h-screen min-h-[100vh] bg-purple-900 rounded-b-[3rem] md:rounded-b-[5rem] overflow-hidden"
      style={{ height: "100vh", minHeight: "100vh" }}
    >
      {/* Loading Screen */}
      {showLoading && (
        <LoadingScreen
          isExiting={isExiting}
          isVideoLoaded={isVideoLoaded}
          onLoadingComplete={handleLoadingComplete}
        />
      )}

      {/* Fallback gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 z-0 rounded-b-[3rem] md:rounded-b-[5rem]" />

      {/* Video Background - Optimized */}
      <video
        ref={videoRef}
        className={`absolute inset-0 w-full h-full object-cover z-[1] transition-opacity duration-1000 rounded-b-[3rem] md:rounded-b-[5rem] ${
          isVideoLoaded ? "opacity-100" : "opacity-0"
        }`}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        poster="/images/hero-poster.jpg"
        onCanPlayThrough={handleVideoReady}
        onLoadedData={handleVideoReady}
        onError={() => setIsVideoLoaded(true)}
      >
        <source src="/hero-video-high-resolution.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Gradient Overlays for better text visibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 z-[2] rounded-b-[3rem] md:rounded-b-[5rem]" />

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
          <p className="text-white/70 text-xs md:text-sm text-center mt-4 tracking-wider">
            20th - 22nd Feb
          </p>
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none z-[3] rounded-b-[3rem] md:rounded-b-[5rem]" />
    </div>
  );
}
