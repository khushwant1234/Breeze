"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isHomepage = pathname === "/";

  return (
    <div
      className="min-h-screen text-white"
      style={{
        background: isHomepage
          ? "black"
          : "linear-gradient(90deg, #3D025ABD 0%, transparent 50%, #3D025ABD 100%), black",
      }}
    >
      <Navbar />

      <main>{children}</main>

      <div>
        <Footer />
      </div>
    </div>
  );
}
