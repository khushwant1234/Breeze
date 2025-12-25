"use client";
import Image from "next/image";
import { useEffect, useState, useRef, useCallback, useMemo } from "react";

// Photo data with scattered positions - centered but asymmetric
const photos = [
  {
    src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=280&h=210&fit=crop",
    width: 280,
    height: 210,
    top: 5,
    left: 32,
  },
  {
    src: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=320&h=240&fit=crop",
    width: 320,
    height: 240,
    top: 8,
    left: 58,
  },
  {
    src: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=220&h=165&fit=crop",
    width: 220,
    height: 165,
    top: 12,
    left: 42,
  },
  {
    src: "https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=290&h=190&fit=crop",
    width: 290,
    height: 190,
    top: 18,
    left: 28,
  },
  {
    src: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=240&h=180&fit=crop",
    width: 240,
    height: 180,
    top: 15,
    left: 68,
  },
  {
    src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=330&h=250&fit=crop",
    width: 330,
    height: 250,
    top: 24,
    left: 38,
  },
  {
    src: "https://images.unsplash.com/photo-1511593358241-7eea1f3c84e5?w=260&h=195&fit=crop",
    width: 260,
    height: 195,
    top: 22,
    left: 62,
  },
  {
    src: "https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=285&h=215&fit=crop",
    width: 285,
    height: 215,
    top: 30,
    left: 25,
  },
  {
    src: "https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=235&h=175&fit=crop",
    width: 235,
    height: 175,
    top: 28,
    left: 72,
  },
  {
    src: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=310&h=230&fit=crop",
    width: 310,
    height: 230,
    top: 35,
    left: 48,
  },
  {
    src: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=230&h=170&fit=crop",
    width: 230,
    height: 170,
    top: 38,
    left: 35,
  },
  {
    src: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=300&h=225&fit=crop",
    width: 300,
    height: 225,
    top: 42,
    left: 65,
  },
  {
    src: "https://images.unsplash.com/photo-1490682143684-14369e18dce8?w=245&h=185&fit=crop",
    width: 245,
    height: 185,
    top: 48,
    left: 30,
  },
  {
    src: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=275&h=205&fit=crop",
    width: 275,
    height: 205,
    top: 45,
    left: 70,
  },
  {
    src: "https://images.unsplash.com/photo-1468276311594-df7cb65d8df6?w=315&h=235&fit=crop",
    width: 315,
    height: 235,
    top: 52,
    left: 45,
  },
  {
    src: "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?w=255&h=190&fit=crop",
    width: 255,
    height: 190,
    top: 55,
    left: 26,
  },
  {
    src: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=340&h=255&fit=crop",
    width: 340,
    height: 255,
    top: 58,
    left: 60,
  },
  {
    src: "https://images.unsplash.com/photo-1418065460487-3e41a6c84dc5?w=250&h=185&fit=crop",
    width: 250,
    height: 185,
    top: 65,
    left: 38,
  },
  {
    src: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=295&h=220&fit=crop",
    width: 295,
    height: 220,
    top: 62,
    left: 68,
  },
  {
    src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=265&h=200&fit=crop",
    width: 265,
    height: 200,
    top: 72,
    left: 33,
  },
  {
    src: "https://images.unsplash.com/photo-1500964757637-c85e8a162699?w=325&h=245&fit=crop",
    width: 325,
    height: 245,
    top: 70,
    left: 55,
  },
];

// Memoized photo component to prevent unnecessary re-renders
const PhotoCard = ({
  photo,
  idx,
  dispersed,
}: {
  photo: (typeof photos)[0];
  idx: number;
  dispersed: boolean;
}) => {
  const photoZIndex = idx % 3 === 0 ? 8 : 3;

  return (
    <div
      className="absolute will-change-transform"
      style={{
        top: dispersed ? `${photo.top}%` : "20vh",
        left: dispersed ? `${photo.left}%` : "50%",
        transform: "translate(-50%, -50%)",
        transition: "top 1.5s ease-out, left 1.5s ease-out",
        zIndex: photoZIndex,
      }}
    >
      <div className="rounded-2xl overflow-hidden bg-white shadow-2xl">
        <Image
          src={photo.src}
          alt={`Sponsor ${idx + 1}`}
          width={photo.width}
          height={photo.height}
          className="block object-contain"
          loading="lazy"
        />
      </div>
    </div>
  );
};

export default function Gallery() {
  const [scrollY, setScrollY] = useState(0);
  const [dispersed, setDispersed] = useState(false);
  const galleryRef = useRef<HTMLDivElement>(null);
  const [galleryBounds, setGalleryBounds] = useState({ top: 0, height: 0 });
  const rafRef = useRef<number | null>(null);

  // Update gallery bounds on mount and resize
  useEffect(() => {
    const updateBounds = () => {
      if (galleryRef.current) {
        const rect = galleryRef.current.getBoundingClientRect();
        setGalleryBounds({
          top: window.scrollY + rect.top,
          height: rect.height,
        });
      }
    };

    // Run immediately and also after a short delay to ensure DOM is ready
    updateBounds();
    const timeoutId = setTimeout(updateBounds, 100);

    window.addEventListener("resize", updateBounds);
    window.addEventListener("scroll", updateBounds, { passive: true });

    return () => {
      window.removeEventListener("resize", updateBounds);
      window.removeEventListener("scroll", updateBounds);
      clearTimeout(timeoutId);
    };
  }, []);

  // Intersection observer for dispersion trigger
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setDispersed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (galleryRef.current) {
      observer.observe(galleryRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Optimized scroll handler with requestAnimationFrame
  useEffect(() => {
    const handleScroll = () => {
      if (rafRef.current) return;

      rafRef.current = requestAnimationFrame(() => {
        setScrollY(window.scrollY);
        rafRef.current = null;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Calculate text position state
  const windowHeight = typeof window !== "undefined" ? window.innerHeight : 800;

  // Define scroll zones
  const entryZoneStart = galleryBounds.top - windowHeight; // When gallery top enters viewport
  const entryZoneEnd = galleryBounds.top; // When viewport top reaches gallery top
  const exitZoneStart = galleryBounds.top + galleryBounds.height - windowHeight; // Start scrolling out
  const exitZoneEnd = galleryBounds.top + galleryBounds.height; // Gallery fully passed

  // Calculate which zone we're in and the progress within that zone
  const textPosition = useMemo(() => {
    // Don't calculate position until bounds are properly initialized
    if (galleryBounds.height === 0) {
      return { top: "50%", position: "fixed" as const, visible: true };
    }

    const galleryStart = galleryBounds.top;
    const galleryEnd = galleryBounds.top + galleryBounds.height;
    const viewportBottom = scrollY + windowHeight;

    // Before gallery enters viewport - text below screen
    if (viewportBottom < galleryStart) {
      return { top: "150%", position: "fixed" as const, visible: true };
    }

    // Scrolling in phase - gallery is entering viewport from bottom
    // Text moves from bottom (150%) to center (50%)
    if (scrollY < galleryStart) {
      const scrollIntoGallery = viewportBottom - galleryStart;
      const progress = Math.min(1, scrollIntoGallery / windowHeight);
      const topPercent = 150 - progress * 100; // 150% -> 50%
      return {
        top: `${Math.max(50, topPercent)}%`,
        position: "fixed" as const,
        visible: true,
      };
    }

    // Pinned phase - scrolling through gallery
    if (scrollY < exitZoneStart) {
      return { top: "50%", position: "fixed" as const, visible: true };
    }

    // Scrolling out phase - text moves from center to top
    if (scrollY < galleryEnd) {
      const progress = (scrollY - exitZoneStart) / windowHeight;
      const topPercent = 50 - progress * 100; // 50% -> -50%
      return {
        top: `${topPercent}%`,
        position: "fixed" as const,
        visible: true,
      };
    }

    // After gallery - text above viewport
    return { top: "-50%", position: "fixed" as const, visible: true };
  }, [scrollY, galleryBounds, windowHeight, exitZoneStart]);

  const isInGalleryZone = useMemo(
    () =>
      scrollY >= galleryBounds.top &&
      scrollY < galleryBounds.top + galleryBounds.height - windowHeight,
    [scrollY, galleryBounds, windowHeight]
  );
  const hasPassedGallery = useMemo(
    () => scrollY >= galleryBounds.top + galleryBounds.height - windowHeight,
    [scrollY, galleryBounds, windowHeight]
  );

  // Check if we're anywhere within the gallery component
  const isInGallery = useMemo(
    () =>
      scrollY + windowHeight > galleryBounds.top &&
      scrollY < galleryBounds.top + galleryBounds.height,
    [scrollY, galleryBounds, windowHeight]
  );

  // Background position styles
  const bgPositionStyle = useMemo(
    () =>
      ({
        position: isInGalleryZone ? "fixed" : "absolute",
        top: isInGalleryZone ? 0 : hasPassedGallery ? "auto" : 0,
        bottom: hasPassedGallery ? 0 : "auto",
        left: 0,
        right: 0,
        height: "100vh",
        zIndex: 0,
      } as React.CSSProperties),
    [isInGalleryZone, hasPassedGallery]
  );

  // Text position styles - scroll in, pin, scroll out
  const textPositionStyle = useMemo(
    () =>
      ({
        position: textPosition.position,
        top: textPosition.top,
        left: "50%",
        transform: "translate(-50%, -50%) translateX(5%)",
        zIndex: 1,
        pointerEvents: "none",
        visibility: textPosition.visible ? "visible" : "hidden",
      } as React.CSSProperties),
    [textPosition]
  );

  return (
    <div
      ref={galleryRef}
      className="relative bg-black overflow-hidden"
      style={{ height: "5500px", zIndex: 1 }}
    >
      {/* Fixed background with purple circles and gallery text */}
      <div
        className="pointer-events-none transition-all duration-300 ease-out"
        style={bgPositionStyle}
      >
        {/* Purple circles */}
        <div
          className="absolute bg-purple-900 rounded-full opacity-40"
          style={{ top: "-60px", right: "-60px", width: 280, height: 280 }}
        />
        <div
          className="absolute bg-purple-900 rounded-full opacity-40"
          style={{ top: "20%", left: "-80px", width: 240, height: 240 }}
        />
        <div
          className="absolute bg-purple-900 rounded-full opacity-40"
          style={{ top: "55%", right: "-70px", width: 260, height: 260 }}
        />
        <div
          className="absolute bg-purple-900 rounded-full opacity-40"
          style={{ bottom: "-100px", left: "-90px", width: 300, height: 300 }}
        />
      </div>

      {/* "THE GALLERY" text - fixed to center */}
      <div style={textPositionStyle}>
        <div className="relative w-[600px] h-[180px]">
          <span className="absolute top-2 left-3 text-white text-[86px] leading-[0.9] tracking-[10px] font-bold uppercase">
            THE
          </span>
          <span className="absolute left-2.5 top-[52px] text-[#ff1fb7] text-[138px] leading-[0.85] font-normal">
            gallery
          </span>
        </div>
      </div>

      {/* Photo gallery */}
      <div className="absolute inset-0 pointer-events-none">
        {photos.map((photo, idx) => (
          <PhotoCard key={idx} photo={photo} idx={idx} dispersed={dispersed} />
        ))}
      </div>
    </div>
  );
}
