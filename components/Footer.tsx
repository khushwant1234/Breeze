// components/Footer.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import heroimg from "./breeze.png";
import Image from "next/image";
import SocialLinks from "./sociallinks";

export default function Footer({ className = "" }: { className?: string }) {
  const footerRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  // 🌫️ Blur state
  const [blurAmount, setBlurAmount] = useState(0);

  // ✅ Content Visibility Logic (Unchanged)
  useEffect(() => {
    const content = contentRef.current;
    if (!content) return;
    content.style.opacity = "1";
    content.style.transform = "translateY(0px)";
  }, []);

  // 🌫️ Scroll-based blur effect above footer
  useEffect(() => {
    const handleScroll = () => {
      const footer = footerRef.current;
      if (!footer) return;

      const rect = footer.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Trigger blur when footer starts entering viewport
      if (rect.top < windowHeight) {
        const progress = Math.min(1, Math.max(0, 1 - rect.top / windowHeight));
        const blurValue = progress * 20; // max blur intensity (20px)
        setBlurAmount(blurValue);
      } else {
        setBlurAmount(0);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* 🌫️ BLUR OVERLAY */}
      <div
        className="fixed top-0 left-0 w-full h-full pointer-events-none z-20"
        style={{
          backdropFilter: `blur(${blurAmount}px)`,
          WebkitBackdropFilter: `blur(${blurAmount}px)`,
          background: `linear-gradient(to bottom,
            rgba(0, 0, 0, ${Math.min(blurAmount / 60, 0.15)}) 0%,
            rgba(0, 0, 0, 0) 100%)`,
          transition: "backdrop-filter 0.3s ease-out, background 0.4s ease-out",
        }}
      ></div>

      {/* FOOTER */}
      <div
        id="contact"
        ref={footerRef}
        className={`relative w-full min-h-[50vh] overflow-hidden z-20 scroll-mt-[90px] ${className}`}
        style={{
          background: "linear-gradient(to top, #440065 0%, #000000 100%)",
        }}
      >
        <div
          ref={contentRef}
          className="relative z-20 py-14 max-w-7xl mx-auto w-full text-white
          flex flex-col min-h-[60vh] transition-all duration-500 ease-out"
          style={{ opacity: 0, transform: "translateY(24px)" }}
        >
          <div className="w-full grid grid-cols-4 h-full px-10 md:px-16">
            {/* LEFT */}
            <div className="font-mono uppercase tracking-widest text-white flex flex-col justify-between h-full col-span-2">
              <div className="absolute left-0 top-5 text-sm opacity-90 whitespace-nowrap">
                <p>The Flagship Techno</p>
                <p>Cultural Fest Of Shiv Nadar University</p>
              </div>
              <div className="absolute left-0 top-[360px] z-20 w-[300px] h-[200px]">
                <Image
                  src={heroimg.src}
                  alt="Event hero"
                  fill
                  className="object-contain"
                />
              </div>
            </div>

            {/* RIGHT */}
            <div
              className="font-mono uppercase tracking-wider text-white/95 
            flex flex-col justify-between h-full border-l-[1.5px] border-dashed border-white/30 pl-10 
            absolute top-0 bottom-0 right-[80px] w-[25%] z-20"
            >
              <div>
                <p className="absolute top-10 text-s mb-20">[ Get In Touch ]</p>

                <div className="mt-24 space-y-4">
                  <p className="text-sm font-semibold">Email ID</p>

                  <div className="relative w-full max-w-xs">
                    <input
                      type="email"
                      placeholder="Enter your Email ID"
                      className="w-full bg-transparent border border-white/40 rounded-md px-4 py-2 pr-10 text-sm placeholder-white/60 focus:outline-none focus:border-white transition-all duration-300"
                    />
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="white"
                      className="absolute right-3 top-2.5 w-5 h-5 opacity-70"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21.75 8.25l-9.75 6.75L2.25 8.25m19.5 0A2.25 2.25 0 0019.5 6H4.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h15a2.25 2.25 0 002.25-2.25v-9z"
                      />
                    </svg>
                  </div>

                  <p className="text-xs text-white/80 leading-relaxed max-w-xs">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut
                    et massa mi. Aliquam in hendrerit urna. Pellentesque sit
                    amet sapien fringilla.
                  </p>
                </div>

                <p className="absolute bottom-10 left-10 text-s mb-20">
                  [ Find Us At ]
                </p>
                <div className="absolute bottom-20 z-20">
                  <SocialLinks />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
