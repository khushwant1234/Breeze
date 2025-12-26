"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen text-white bg-black">
      <Navbar />

      <main>{children}</main>

      <div>
        <Footer />
      </div>
    </div>
  );
}
