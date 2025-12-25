"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { FaBars } from "react-icons/fa";
import SoundButton from "./SoundButton";
import { Sheet, SheetContent, SheetHeader } from "./ui/sheet";
import { cn } from "@/lib/utils";
import "../app/globals.css";

interface NavbarProps {
  className?: string;
}

const Navbar = ({ className }: NavbarProps) => {
  const pathname = usePathname();

  type NavLink =
    | { name: string; href: string }
    | { name: string; scrollTo: string };

  const navLinks: NavLink[] = [
    { name: "Home", href: "/" },
    { name: "Events", href: "/events" },
    { name: "Merch", href: "/merch" },
    { name: "Sponsors", href: "/sponsors" },
    { name: "Team", href: "/team" },
    { name: "Contact Us", href: "/get-in-touch" },
  ];

  const [isPlaying, setIsPlaying] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);

  const handleTogglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleLinkClick = () => {
    if (isOpen) {
      setIsOpen(false);
    }
  };

  // Hide/show navbar on scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 10);
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollPos]);

  const isActiveLink = (path: string) => {
    if (path === "/merch") {
      return pathname.startsWith("/merch") || pathname.startsWith("/product");
    }
    return pathname === path;
  };

  return (
    <nav
      className={cn(
        "w-full fixed top-0 left-0 z-50 bg-orange-600 transition-transform duration-300",
        visible ? "translate-y-0" : "-translate-y-full",
        className
      )}
    >
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* LOGO */}
        <Link href="/">
          <Image
            src="/images/logo/logo.png"
            className="md:w-[90px] md:h-[50px] w-[60px] h-[40px] object-contain"
            alt="Breeze Logo"
            width={100}
            height={100}
          />
        </Link>

        {/* CENTER NAV LINKS - Desktop */}
        <div className="hidden md:flex flex-1 justify-center space-x-8">
          {navLinks.map((link) =>
            "scrollTo" in link ? (
              <button
                key={link.name}
                onClick={() =>
                  document
                    .getElementById(link.scrollTo)
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="text-navbar_text text-[15px] font-bold transition-colors hover:text-navbar_text_select"
              >
                {link.name}
              </button>
            ) : (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "text-[15px] font-bold transition-colors hover:text-navbar_text_select",
                  isActiveLink(link.href)
                    ? "text-navbar_text_select"
                    : "text-navbar_text"
                )}
              >
                {link.name}
              </Link>
            )
          )}
        </div>

        {/* RIGHT SIDE ACTIONS */}
        <div className="flex items-center space-x-3">
          {/* SOUND BUTTON */}
          <SoundButton isPlaying={isPlaying} onToggle={handleTogglePlay} />

          {/* CART ICON */}
          <Link
            href="/cart"
            className="flex items-center justify-center w-10 h-10 transition duration-200 hover:bg-purple-900 rounded"
            aria-label="Cart"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.6 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
            </svg>
          </Link>

          {/* MOBILE MENU BUTTON */}
          <button className="md:hidden" onClick={toggleSidebar}>
            <FaBars className="text-white text-xl cursor-pointer" />
          </button>
        </div>
      </div>

      {/* MOBILE SIDEBAR */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent className="border-0 m-0 bg-orange-600">
          <SheetHeader className="mt-10">
            <nav className="flex flex-col space-y-4">
              {navLinks.map((link) =>
                "scrollTo" in link ? (
                  <button
                    key={link.name}
                    onClick={() => {
                      document
                        .getElementById(link.scrollTo)
                        ?.scrollIntoView({ behavior: "smooth" });
                      handleLinkClick();
                    }}
                    className="text-navbar_text text-[15px] font-bold text-left"
                  >
                    {link.name}
                  </button>
                ) : (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={handleLinkClick}
                    className={cn(
                      "text-[15px] font-bold",
                      isActiveLink(link.href)
                        ? "text-navbar_text_select"
                        : "text-navbar_text"
                    )}
                  >
                    {link.name}
                  </Link>
                )
              )}
            </nav>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </nav>
  );
};

export default Navbar;
