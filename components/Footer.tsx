// components/Footer.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import heroimg from "./breeze.png";
import SocialLinks from "./sociallinks";

const BracketHeader = ({ text }: { text: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsOpen(true);
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="font-mono text-sm uppercase tracking-widest flex items-center overflow-hidden transition-all duration-1000 ease-out"
      style={{ maxWidth: isOpen ? "100%" : "20px", opacity: isOpen ? 1 : 0.3 }}
    >
      <span className="shrink-0 text-white">[</span>
      <span
        className={`px-3 whitespace-nowrap transition-all duration-700 delay-200 text-white ${
          isOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
        }`}
      >
        {text}
      </span>
      <span className="shrink-0 text-white">]</span>
    </div>
  );
};

export default function Footer({
  className = "",
  nextPage = "/",
}: {
  className?: string;
  nextPage?: string;
}) {
  const router = useRouter();
  const [hasMounted, setHasMounted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const [loadingNext, setLoadingNext] = useState(false);
  const [blurAmount, setBlurAmount] = useState(0);

  const footerRef = useRef<HTMLDivElement | null>(null);
  const overscrollAcc = useRef(0);
  const touchStartY = useRef(0);
  const decreaseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const isDecreasingRef = useRef(false);
  const OVERSCROLL_THRESHOLD = 800;

  // Fix Hydration Error: Only render logic after mount
  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (!hasMounted) return;

    const handleNavigation = () => {
      setLoadingNext(true);
      sessionStorage.setItem("nextPageTarget", nextPage);
      router.push("/loading");
    };

    const stopDecrease = () => {
      isDecreasingRef.current = false;
      if (decreaseTimerRef.current) {
        clearTimeout(decreaseTimerRef.current);
        decreaseTimerRef.current = null;
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };

    const runDecrease = () => {
      if (!isDecreasingRef.current) return;

      overscrollAcc.current = Math.max(0, overscrollAcc.current - 20);
      const newProgress = (overscrollAcc.current / OVERSCROLL_THRESHOLD) * 100;
      setProgress(newProgress);

      if (overscrollAcc.current <= 0) {
        stopDecrease();
        setProgress(0);
        setVisible(false);
      } else {
        animationFrameRef.current = requestAnimationFrame(runDecrease);
      }
    };

    const startDecreaseTimer = () => {
      stopDecrease();

      if (overscrollAcc.current <= 0) return;

      decreaseTimerRef.current = setTimeout(() => {
        isDecreasingRef.current = true;
        animationFrameRef.current = requestAnimationFrame(runDecrease);
      }, 800);
    };

    const updateProgress = (delta: number) => {
      if (loadingNext) return;

      const isAtBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 50;

      // User is scrolling down at the bottom - increase progress
      if (isAtBottom && delta > 0) {
        stopDecrease();

        setVisible(true);
        overscrollAcc.current += delta;
        const nextProgress = Math.min(
          (overscrollAcc.current / OVERSCROLL_THRESHOLD) * 100,
          100
        );
        setProgress(nextProgress);

        if (nextProgress >= 100) {
          handleNavigation();
        } else {
          startDecreaseTimer();
        }
      }
      // User scrolls up - start decrease timer
      else if (delta < 0 && overscrollAcc.current > 0) {
        startDecreaseTimer();
      }
    };

    const onWheel = (e: WheelEvent) => {
      updateProgress(e.deltaY);
    };
    const onTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      const deltaY = touchStartY.current - e.touches[0].clientY;
      const isAtBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 80;
      if (isAtBottom && deltaY > 0) {
        if (e.cancelable) e.preventDefault();
        updateProgress(deltaY * 2);
      } else if (deltaY < 0) {
        updateProgress(deltaY);
      }
      touchStartY.current = e.touches[0].clientY;
    };
    const onTouchEnd = () => {
      if (
        overscrollAcc.current > 0 &&
        overscrollAcc.current < OVERSCROLL_THRESHOLD
      ) {
        startDecreaseTimer();
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd);

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      stopDecrease();
    };
  }, [hasMounted, router, loadingNext, nextPage]);

  useEffect(() => {
    const handleScroll = () => {
      if (!footerRef.current) return;
      const rect = footerRef.current.getBoundingClientRect();
      const footerHeight = rect.height;
      // Calculate how much of the footer is visible in the viewport
      const visibleHeight = Math.min(window.innerHeight - rect.top, footerHeight);
      const visibilityRatio = visibleHeight / footerHeight;
      
      // Only start blur effect when footer is 75% visible (visibilityRatio >= 0.75)
      // Then scale the blur from 0 to 15 based on remaining 25% visibility
      if (visibilityRatio >= 0.75) {
        // Map 0.75-1.0 visibility to 0-1 for blur calculation
        const blurProgress = (visibilityRatio - 0.75) / 0.25;
        setBlurAmount(blurProgress * 15);
      } else {
        setBlurAmount(0);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Hydration Guard
  if (!hasMounted) return null;

  return (
    <>
      {/* Blur Overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-20"
        style={{
          backdropFilter: `blur(${blurAmount}px)`,
          WebkitBackdropFilter: `blur(${blurAmount}px)`,
          background: `linear-gradient(to bottom, rgba(0,0,0,${Math.min(
            blurAmount / 50,
            0.2
          )}) 0%, transparent 100%)`,
          transition: "backdrop-filter 0.3s ease-out",
        }}
      />

      {/* Progress Indicator */}
      <div
        className={`fixed bottom-6 left-1/2 -translate-x-1/2 md:translate-x-0 md:left-auto md:bottom-10 md:right-10 z-[100] flex items-center gap-4
        text-white text-[10px] tracking-[0.3em] font-bold transition-all duration-500 whitespace-nowrap
        ${
          visible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        <span>NEXT PAGE</span>
        <div className="relative w-16 md:w-20 h-[2px] bg-white/20 overflow-hidden">
          <div
            className="absolute h-full bg-white transition-all duration-150 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <footer
        ref={footerRef}
        id="contact"
        className={`relative w-full h-auto md:min-h-[70vh] flex flex-col justify-center overflow-hidden z-30 scroll-mt-[90px] ${className}`}
        style={{ background: "linear-gradient(to top, #2a003e 0%, #000 100%)" }}
      >
        {/* Full Height Dotted Line (Desktop) */}
        <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px border-l-2 border-dotted border-white/20 -translate-x-1/2 z-0 pointer-events-none" />

        <div className="max-w-7xl mx-auto w-full px-6 md:px-16 py-12 md:py-20 z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">
            {/* Left Section */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left justify-between space-y-8 md:space-y-12">
              <div className="relative right-20 bottom-20 order-2 md:order-1 space-y-2 opacity-80">
                <p className="text-[10px] md:text-xs tracking-[0.3em] md:tracking-[0.4em] uppercase text-white">
                  The Flagship Techno
                </p>
                <p className="text-[10px] md:text-xs tracking-[0.3em] md:tracking-[0.4em] uppercase text-white">
                  Cultural Fest of SNU
                </p>
              </div>

              <div className="relative right-35 top-30 order-1 md:order-2 w-48 md:w-full max-w-[300px] md:max-w-[400px] aspect-video">
                <Image
                  src={heroimg}
                  alt="Breeze Logo"
                  fill
                  className="object-contain"
                />
              </div>
            </div>

            {/* Right Section */}
            <div className="border-t-2 border-dotted border-white/20 md:border-0 h-full pt-10 md:pt-0 pl-0 md:pl-16 space-y-12 md:space-y-16">
              <div className="space-y-8">
                <BracketHeader text="Get In Touch" />
                <div className="space-y-6">
                  <div className="relative group max-w-full md:max-w-sm">
                    <input
                      type="email"
                      placeholder="ENTER EMAIL"
                      className="w-full bg-transparent border-b border-white/20 pb-2 text-sm tracking-widest focus:outline-none focus:border-purple-500 transition-colors rounded-none text-white"
                    />
                  </div>
                  <p className="text-xs text-white leading-relaxed max-w-full md:max-w-xs font-mono">
                    STAY UPDATED WITH THE LATEST ANNOUNCEMENTS AND EVENT
                    SCHEDULES.
                  </p>
                </div>
              </div>

              <div className="space-y-8">
                <BracketHeader text="Find Us At" />
                <SocialLinks />
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
