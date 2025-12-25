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
    <div className="pt-12 bg-background">
      <title>Events - Breeze '25</title>
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
        <h1 className="text-xl sm:text-2xl font-bold">संस्कारी AF</h1>
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
        <h1 className="text-xl sm:text-2xl font-bold">Challenge Your Mind</h1>
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
