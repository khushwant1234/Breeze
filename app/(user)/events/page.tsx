import BasicCards from "@/components/events/BasicCards";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import localFont from "next/font/local";
import { Fraunces } from "next/font/google";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const satoshi = localFont({
  src: "../../../public/fonts/Satoshi-Regular.woff",
  weight: "800",
  style: "normal",
});
const satoshi_bold = localFont({
  src: "../../../public/fonts/Satoshi-Bold.woff",
  weight: "800",
  style: "normal",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  weight: ["400"],
  style: ["normal", "italic"],
});

const page = async ({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) => {
  const params = await searchParams;
  const cultural = await prisma.eventItem.findMany({
    select: {
      event_name: true,
      event_description: true,
      event_price: true,
      event_time: true,
      event_venue: true,
      event_org: true,
      event_date: true,
      image_url: true,
      id: true,
      registration_open: true,
    },
    where: {
      event_type: {
        equals: "Cultural",
      },
    },
    take: 5,
  });
  const technical = await prisma.eventItem.findMany({
    select: {
      event_name: true,
      event_description: true,
      event_price: true,
      event_time: true,
      event_venue: true,
      event_org: true,
      event_date: true,
      image_url: true,
      id: true,
      registration_open: true,
    },
    where: {
      event_type: {
        equals: "Technical",
      },
    },
    take: 5,
  });
  return (
    <div className="pt-12 bg-background relative">
      <title>Events - Breeze '25</title>

      {/* Floating Cart Icon */}
      <Link
        href="/cart"
        className="fixed bottom-8 right-8 z-50 w-16 h-16 bg-[#ffbc00] hover:bg-[#ffbc00]/90 rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 group"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-8 h-8 text-[#8200C1]"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
          />
        </svg>
      </Link>

      <div className="relative h-[70vh]">
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src="/images/events-banner.png"
            alt="Homepage image 2"
            layout="fill"
            objectFit="cover"
            objectPosition="center"
            priority
          />
        </div>
        <div className="absolute inset-0 w-full h-full bg-[#00000099]"></div>
        <div className="absolute inset-0 flex flex-col gap-2 items-center justify-center text-white">
          <div className="text-center px-12 lg:px-32">
            <div className={`text-4xl lg:text-7xl ${satoshi.className}`}>
              Here's A Sneak Peek
            </div>
            <div
              className={`text-4xl lg:text-7xl ${fraunces.className} italic`}
            >
              At All The Amazing Events In Store!
            </div>
            <div className={`lg:text-2xl ${satoshi.className}`}>
              Dive into the whirlwind of excitement! Explore the electrifying
              lineup of events that make Breeze 2025 the ultimate fusion of
              innovation, culture, and celebration.
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2 sm:gap-1 m-10 mb-0 px-2 sm:px-6">
        <h1 className="text-xl sm:text-2xl font-bold font-urban-vogue">
          संस्कारी AF
        </h1>
        <div className="flex justify-between items-center flex-wrap sm:flex-nowrap sm:gap-5 gap-3 ">
          <p
            className={`text-4xl sm:text-5xl font-thin ${satoshi_bold.className} font-bold`}
          >
            Cultural Events
          </p>
          <div className="flex justify-center items-center">
            <Link href="/events/cultural">
              <Button
                variant="link"
                className="text-lg sm:text-xl underline pl-0 sm:pl-4"
              >
                See All
              </Button>
            </Link>
            <Link href="/events/cultural">
              <Image
                src="/Icons/arrow-2.svg"
                alt="Icon"
                width={32}
                height={32}
                className="shrink-0 min-h-6 min-w-6"
              />
            </Link>
          </div>
        </div>
      </div>
      <div className="mt-4 px-12">
        <BasicCards event={cultural} />
      </div>
      <div className="flex flex-col gap-2 sm:gap-1 m-10 mb-0 px-2 sm:px-6">
        <h1 className="text-xl sm:text-2xl font-bold font-urban-vogue">
          Challenge Your Mind !
        </h1>
        <div className="flex justify-between items-center flex-wrap sm:flex-nowrap sm:gap-5 gap-3 ">
          <p
            className={`text-4xl sm:text-5xl font-thin ${satoshi_bold.className} font-bold`}
          >
            Technical Events
          </p>
          <div className="flex justify-center items-center">
            <Link href="/events/technical">
              <Button
                variant="link"
                className="text-lg sm:text-xl underline pl-0 sm:pl-4"
              >
                See All
              </Button>
            </Link>
            <Link href="/events/technical">
              <Image
                src="/Icons/arrow-2.svg"
                alt="Icon"
                width={37}
                height={37}
                className="shrink-0 min-h-10 min-w-10"
              />
            </Link>
          </div>
        </div>
      </div>
      <div className="mt-4 mb-40 px-12">
        <BasicCards event={technical} />
      </div>
    </div>
  );
};

export default page;
