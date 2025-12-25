import React from "react";
import { prisma } from "@/lib/prisma";
import { AddToCartEvent } from "@/components/product/AddToCart";
import Image from "next/image";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const event = await prisma.eventItem.findUnique({
    where: { id: (await params).id },
  });

  if (!event) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-600 text-xl">
        Event not found
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center pt-20 md:pt-32 pb-16 md:pb-24 px-6 sm:px-12">
      <title>{event.event_name + " - Breeze '25"}</title>
      <div>
        <h1 className="text-4xl  font-bold sm:text-5xl italic mb-6">
          {event.event_name}
        </h1>
      </div>
      <div className="flex flex-col xl:flex-row items-center justify-center md:gap-10 mb-8 pt-4 px-4 sm:px-8">
        {/* Image Section */}
        <div className="relative xl:self-start aspect-[3/4] h-[400px] sm:w-[450px] md:h-[600px] rounded-3xl overflow-hidden bg-yellow-500">
          <Image
            src={`https://media.breezesnu.com/${event.image_url}`}
            alt={`${event.event_name} poster`}
            fill
            className="object-cover transition-transform duration-300 hover:scale-105"
            priority
          />
        </div>

        {/* Event Details Section */}
        <div className="flex flex-col w-full xl:w-1/3 self-start sm:ml-8 mt-8 sm:mt-0 gap-3 md:gap-4">
          <h2 className="text-2xl sm:text-3xl  font-semibold text-orange-700">
            Organized by {event.event_org}
          </h2>
          <div>
            <h3 className="text-lg sm:text-xl  font-bold md:mt-5 mt-0 text-gray-600 mb-1">
              Description:
            </h3>
            <p className="text-base sm:text-lg text-gray-500">
              {event.event_description}
            </p>
          </div>
          <h3 className="text-lg sm:text-xl">
            <span className="font-bold text-gray-700">Date:</span>{" "}
            {event.event_date}
          </h3>
          <h3 className="text-lg sm:text-xl">
            <span className="font-bold text-gray-700">Time:</span>{" "}
            {event.event_time}
          </h3>
          <h3 className="text-lg sm:text-xl">
            <span className="font-bold text-gray-700">Location:</span>{" "}
            {event.event_venue}
          </h3>
          <h3 className="text-lg sm:text-xl">
            <span className="font-bold text-gray-700">Price:</span>{" "}
            {event.event_price === 0 ? "Free" : `Rs. ${event.event_price}`}
          </h3>
          <div className="md:mt-4 -mt-4 self-center text-2xl">
            <AddToCartEvent event_id={event.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
