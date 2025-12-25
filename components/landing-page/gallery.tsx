"use client";

import { useEffect } from "react";
import { motion, stagger, useAnimate } from "motion/react";
import Image from "next/image";

import Floating, { FloatingElement } from "@/components/ui/parallax-floating";

// Gallery images - using Breeze event/festival themed images
const galleryImages = [
  {
    url: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=400&fit=crop",
    title: "Festival Crowd",
  },
  {
    url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=500&fit=crop",
    title: "Concert Lights",
  },
  {
    url: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=500&h=600&fit=crop",
    title: "Stage Performance",
  },
  {
    url: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=400&fit=crop",
    title: "Music Festival",
  },
  {
    url: "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=450&h=450&fit=crop",
    title: "Dance Floor",
  },
  {
    url: "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=500&h=400&fit=crop",
    title: "Festival Night",
  },
  {
    url: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400&h=350&fit=crop",
    title: "Crowd Celebration",
  },
  {
    url: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=350&h=400&fit=crop",
    title: "Party Vibes",
  },
  {
    url: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=400&fit=crop",
    title: "Concert Energy",
  },
  {
    url: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=450&h=350&fit=crop",
    title: "Festival Atmosphere",
  },
  {
    url: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=500&fit=crop",
    title: "Live Music",
  },
  {
    url: "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=350&h=400&fit=crop",
    title: "Stage Lights",
  },
  {
    url: "https://images.unsplash.com/photo-1574391884720-bbc3740c59d1?w=400&h=350&fit=crop",
    title: "Night Event",
  },
  {
    url: "https://images.unsplash.com/photo-1578946956088-940c3b502864?w=450&h=400&fit=crop",
    title: "Celebration",
  },
];

export default function Gallery() {
  const [scope, animate] = useAnimate();

  useEffect(() => {
    animate(
      ".gallery-image",
      { opacity: [0, 1], scale: [0.8, 1] },
      { duration: 0.6, delay: stagger(0.1) }
    );
  }, [animate]);

  return (
    <div
      className="relative w-full min-h-screen bg-black overflow-hidden"
      ref={scope}
    >
      {/* Purple gradient circles for Breeze theme */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute bg-purple-900 rounded-full opacity-40 blur-3xl"
          style={{ top: "-10%", right: "-5%", width: 400, height: 400 }}
        />
        <div
          className="absolute bg-pink-900 rounded-full opacity-30 blur-3xl"
          style={{ top: "30%", left: "-10%", width: 350, height: 350 }}
        />
        <div
          className="absolute bg-purple-800 rounded-full opacity-35 blur-3xl"
          style={{ bottom: "-5%", right: "20%", width: 300, height: 300 }}
        />
      </div>

      {/* Center text */}
      <motion.div
        className="absolute inset-0 z-50 flex flex-col items-center justify-center pointer-events-none"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1 }}
      >
        <div className="relative text-center">
          <span className="block text-white text-5xl md:text-7xl lg:text-8xl tracking-[10px] font-bold uppercase">
            THE
          </span>
          <span className="block text-[#ff1fb7] text-6xl md:text-8xl lg:text-[140px] font-normal italic -mt-2 md:-mt-4">
            gallery
          </span>
        </div>
      </motion.div>

      {/* Floating images */}
      <Floating sensitivity={-1} className="overflow-hidden">
        {/* Top row */}
        <FloatingElement
          depth={0.5}
          className="top-[15%] left-[2%] md:top-[2%] md:left-[5%]"
        >
          <motion.div className="gallery-image" initial={{ opacity: 0 }}>
            <Image
              src={galleryImages[0].url}
              alt={galleryImages[0].title}
              width={240}
              height={240}
              className="w-28 h-28 md:w-40 md:h-40 object-cover rounded-xl shadow-2xl hover:scale-105 duration-200 cursor-pointer transition-transform"
            />
          </motion.div>
        </FloatingElement>

        <FloatingElement
          depth={1.2}
          className="top-[8%] left-[25%] md:top-[5%] md:left-[28%]"
        >
          <motion.div className="gallery-image" initial={{ opacity: 0 }}>
            <Image
              src={galleryImages[1].url}
              alt={galleryImages[1].title}
              width={280}
              height={340}
              className="w-32 h-40 md:w-48 md:h-60 object-cover rounded-xl shadow-2xl hover:scale-105 duration-200 cursor-pointer transition-transform"
            />
          </motion.div>
        </FloatingElement>

        <FloatingElement
          depth={2}
          className="top-[10%] left-[60%] md:top-[3%] md:left-[55%]"
        >
          <motion.div className="gallery-image" initial={{ opacity: 0 }}>
            <Image
              src={galleryImages[2].url}
              alt={galleryImages[2].title}
              width={320}
              height={400}
              className="w-36 h-44 md:w-52 md:h-64 object-cover rounded-xl shadow-2xl hover:scale-105 duration-200 cursor-pointer transition-transform"
            />
          </motion.div>
        </FloatingElement>

        <FloatingElement
          depth={0.8}
          className="top-[18%] left-[85%] md:top-[2%] md:left-[82%]"
        >
          <motion.div className="gallery-image" initial={{ opacity: 0 }}>
            <Image
              src={galleryImages[3].url}
              alt={galleryImages[3].title}
              width={220}
              height={220}
              className="w-24 h-24 md:w-36 md:h-36 object-cover rounded-xl shadow-2xl hover:scale-105 duration-200 cursor-pointer transition-transform"
            />
          </motion.div>
        </FloatingElement>

        {/* Second row */}
        <FloatingElement
          depth={1.8}
          className="top-[30%] left-[5%] md:top-[28%] md:left-[8%]"
        >
          <motion.div className="gallery-image" initial={{ opacity: 0 }}>
            <Image
              src={galleryImages[8].url}
              alt={galleryImages[8].title}
              width={260}
              height={200}
              className="w-32 h-24 md:w-48 md:h-36 object-cover rounded-xl shadow-2xl hover:scale-105 duration-200 cursor-pointer transition-transform"
            />
          </motion.div>
        </FloatingElement>

        <FloatingElement
          depth={0.6}
          className="top-[28%] left-[78%] md:top-[32%] md:left-[85%]"
        >
          <motion.div className="gallery-image" initial={{ opacity: 0 }}>
            <Image
              src={galleryImages[9].url}
              alt={galleryImages[9].title}
              width={220}
              height={280}
              className="w-28 h-36 md:w-40 md:h-52 object-cover rounded-xl shadow-2xl hover:scale-105 duration-200 cursor-pointer transition-transform"
            />
          </motion.div>
        </FloatingElement>

        {/* Middle row - around center text */}
        <FloatingElement
          depth={1.5}
          className="top-[45%] left-[1%] md:top-[42%] md:left-[3%]"
        >
          <motion.div className="gallery-image" initial={{ opacity: 0 }}>
            <Image
              src={galleryImages[4].url}
              alt={galleryImages[4].title}
              width={280}
              height={280}
              className="w-36 h-36 md:w-52 md:h-52 object-cover rounded-xl shadow-2xl hover:scale-105 duration-200 cursor-pointer transition-transform"
            />
          </motion.div>
        </FloatingElement>

        <FloatingElement
          depth={2.5}
          className="top-[42%] left-[72%] md:top-[38%] md:left-[78%]"
        >
          <motion.div className="gallery-image" initial={{ opacity: 0 }}>
            <Image
              src={galleryImages[5].url}
              alt={galleryImages[5].title}
              width={300}
              height={240}
              className="w-40 h-32 md:w-56 md:h-44 object-cover rounded-xl shadow-2xl hover:scale-105 duration-200 cursor-pointer transition-transform"
            />
          </motion.div>
        </FloatingElement>

        <FloatingElement
          depth={1.0}
          className="top-[60%] left-[3%] md:top-[55%] md:left-[5%]"
        >
          <motion.div className="gallery-image" initial={{ opacity: 0 }}>
            <Image
              src={galleryImages[10].url}
              alt={galleryImages[10].title}
              width={240}
              height={300}
              className="w-28 h-36 md:w-44 md:h-56 object-cover rounded-xl shadow-2xl hover:scale-105 duration-200 cursor-pointer transition-transform"
            />
          </motion.div>
        </FloatingElement>

        <FloatingElement
          depth={2.2}
          className="top-[62%] left-[75%] md:top-[58%] md:left-[80%]"
        >
          <motion.div className="gallery-image" initial={{ opacity: 0 }}>
            <Image
              src={galleryImages[11].url}
              alt={galleryImages[11].title}
              width={220}
              height={220}
              className="w-28 h-28 md:w-40 md:h-40 object-cover rounded-xl shadow-2xl hover:scale-105 duration-200 cursor-pointer transition-transform"
            />
          </motion.div>
        </FloatingElement>

        {/* Bottom row */}
        <FloatingElement
          depth={3}
          className="top-[75%] left-[8%] md:top-[72%] md:left-[6%]"
        >
          <motion.div className="gallery-image" initial={{ opacity: 0 }}>
            <Image
              src={galleryImages[6].url}
              alt={galleryImages[6].title}
              width={340}
              height={280}
              className="w-40 h-32 md:w-60 md:h-48 object-cover rounded-xl shadow-2xl hover:scale-105 duration-200 cursor-pointer transition-transform"
            />
          </motion.div>
        </FloatingElement>

        <FloatingElement
          depth={1.4}
          className="top-[80%] left-[28%] md:top-[75%] md:left-[32%]"
        >
          <motion.div className="gallery-image" initial={{ opacity: 0 }}>
            <Image
              src={galleryImages[12].url}
              alt={galleryImages[12].title}
              width={260}
              height={200}
              className="w-32 h-24 md:w-48 md:h-36 object-cover rounded-xl shadow-2xl hover:scale-105 duration-200 cursor-pointer transition-transform"
            />
          </motion.div>
        </FloatingElement>

        <FloatingElement
          depth={1.2}
          className="top-[78%] left-[58%] md:top-[70%] md:left-[56%]"
        >
          <motion.div className="gallery-image" initial={{ opacity: 0 }}>
            <Image
              src={galleryImages[7].url}
              alt={galleryImages[7].title}
              width={260}
              height={300}
              className="w-32 h-40 md:w-48 md:h-56 object-cover rounded-xl shadow-2xl hover:scale-105 duration-200 cursor-pointer transition-transform"
            />
          </motion.div>
        </FloatingElement>

        <FloatingElement
          depth={2.0}
          className="top-[85%] left-[82%] md:top-[78%] md:left-[80%]"
        >
          <motion.div className="gallery-image" initial={{ opacity: 0 }}>
            <Image
              src={galleryImages[13].url}
              alt={galleryImages[13].title}
              width={280}
              height={220}
              className="w-36 h-28 md:w-52 md:h-40 object-cover rounded-xl shadow-2xl hover:scale-105 duration-200 cursor-pointer transition-transform"
            />
          </motion.div>
        </FloatingElement>
      </Floating>
    </div>
  );
}
