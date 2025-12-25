"use client";
import Image from "next/image";
import { useEffect } from "react";
import Link from "next/link";

const loadFont = () => {
  const font = new FontFace(
    "MoneerBold",
    "url('/static/fonts/Moneer-Bold.ttf')"
  );

  font
    .load()
    .then((loadedFont) => {
      document.fonts.add(loadedFont);
    })
    .catch((error) => {
      console.error("Font failed to load:", error);
    });
};

interface NotFoundProps {
  title?: string;
  subtitle?: string;
  imageUrl?: string;
  imageWidth?: number;
  imageHeight?: number;
}

const NotFound: React.FC<NotFoundProps> = ({
  title = "Under Construction",
  subtitle = "This page is still under Construction",
  imageUrl = "/images/404.png",
  imageWidth = 400,
  imageHeight = 300,
}) => {
  useEffect(() => {
    loadFont();
  }, []);

  return (
    <div
      className="flex flex-col justify-center items-center min-h-screen w-full text-center 
      bg-navbar_text_select 
      px-4 py-12 md:px-8 lg:px-16"
    >
      <title>Under Construction</title>
      <div className="w-full max-w-7xl space-y-4">
        <h1
          className="text-5xl md:text-7xl lg:text-9xl"
          style={{
            fontFamily: "MoneerBold",
            marginTop: "5.5rem",
          }}
        >
          {title}
        </h1>

        <div className="flex justify-center mb-6">
          <Image
            src={imageUrl}
            alt="Not Found"
            width={imageWidth}
            height={imageHeight}
            className="mt-6 max-w-full h-auto"
          />
        </div>

        <div className="space-y-4">
          <p className="mt-6 text-lg md:text-xl text-black">{subtitle}</p>
          <p className="text-lg md:text-xl text-black">
            Kindly Head Back To The Homepage!
          </p>
        </div>

        <div className="py-10">
          <Link
            href="/"
            className="inline-block text-black bg-transparent border border-black 
              px-6 py-3 rounded-lg text-lg 
              hover:bg-black hover:text-white transition duration-300"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
