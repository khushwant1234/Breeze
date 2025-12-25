"use client";

import Footer from "@/components/Footer";
import MerchScroll from "@/components/merchscroll";
import BuyMerch from "@/components/buymerch";

export default function MerchPage() {
  return (
    <div className="relative w-full">
      {/* The Scroll Animation Section */}
      <MerchScroll />

      {/* The Product Detail Section */}
      <BuyMerch />

      {/* Footer */}
      <div className="relative z-50 bg-black text-white">
        <Footer />
      </div>
    </div>
  );
}
