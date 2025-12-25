import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { accommodation_option } from "@prisma/client";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const cart: { [key: string]: { size: number } } = data["cart"];
    const accommodation: [boolean, boolean, boolean] = data["accommodation"];

    const merch_items = await prisma.merchItem.findMany();
    const event_items = await prisma.eventItem.findMany();
    const merchPrices = new Map(
      merch_items.map((item) => [item.id, item.product_price])
    );
    const eventPrices = new Map(
      event_items.map((item) => [item.id, item.event_price])
    );

    let total = 0;
    Object.entries(cart).forEach(([item, sizes]) => {
      Object.entries(sizes).forEach(([size, quantity]) => {
        if (merchPrices.has(item)) {
          total += merchPrices.get(item) * quantity;
        } else if (eventPrices.has(item)) {
          total += Number(eventPrices.get(item)) * quantity;
        }
      });
    });

    let num_days = 0;
    let accommodation_array = [];
    let accommodation_price = 0;
    accommodation.forEach((day, i) => {
      if (day) {
        num_days += 1;
        accommodation_array.push(Object.values(accommodation_option)[i]);
      }
    });
    switch (num_days) {
      case 1:
        accommodation_price += 550;
        break;
      case 2:
        accommodation_price += 900;
        break;
      case 3:
        accommodation_price += 1250;
        break;
      default:
        break;
    }

    const id = crypto.randomBytes(32).toString("hex");
    try{await prisma.pendingTransaction.create({
      data: {
        amount: total+accommodation_price,
        id,
        cart,
        accommodation_price, 
        accommodation:
          accommodation_array ? accommodation_array : null,
      },
    });}catch(e){
      console.log(e)
      return NextResponse.json("Error processing checkout", { status: 500 });
    }
    return NextResponse.json({ message: "Success", id }, { status: 200 });
  } catch (e) {
    return NextResponse.json("Error processing checkout", { status: 500 });
  }
}
