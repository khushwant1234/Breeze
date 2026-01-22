"use client";
import Image from "next/image";
import { MerchItem, EventItem } from "@prisma/client";
import CheckoutButton from "@/components/cart/CheckoutButton";
import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";

interface CartDisplayProps {
  merch_items: MerchItem[];
  event_items: EventItem[];
}

export default function CartDisplay({
  merch_items,
  event_items,
}: CartDisplayProps) {
  const [cartItems, setCartItems] = useState<{
    merch: {
      [key: string]: (MerchItem & { quantity: number; size: string })[];
    };
    events: { [key: string]: (EventItem & { quantity: number; ticketType: string })[] };
  }>({
    merch: {},
    events: {},
  });

  const [isLoading, setIsLoading] = useState(true);
  const [needsAccommodation, setNeedsAccommodation] = useState<boolean>(false);
  const [selectedDays, setSelectedDays] = useState<[boolean, boolean, boolean]>(
    [false, false, false]
  );

  useEffect(() => {
    const updateCartFromStorage = () => {
      const cart = JSON.parse(localStorage.getItem("cart") || "{}") || {};
      const updatedCart: typeof cartItems = { merch: {}, events: {} };

      if (merch_items && Array.isArray(merch_items)) {
        merch_items.forEach((item) => {
          if (cart[item.id]) {
            updatedCart.merch[item.id] = Object.entries(cart[item.id]).map(
              ([size, quantity]) => ({
                ...item,
                quantity: quantity as number,
                size,
              })
            );
          }
        });
      }

      if (event_items && Array.isArray(event_items)) {
        event_items.forEach((item) => {
          const eventCart = cart[item.id];
          if (eventCart) {
            const tickets: (EventItem & { quantity: number; ticketType: string })[] = [];
            // Support SINGLE tickets
            if (eventCart["SINGLE"] && eventCart["SINGLE"] > 0) {
              tickets.push({
                ...item,
                quantity: eventCart["SINGLE"],
                ticketType: "SINGLE",
              });
            }
            // Support PAIR tickets
            if (eventCart["PAIR"] && eventCart["PAIR"] > 0) {
              tickets.push({
                ...item,
                quantity: eventCart["PAIR"],
                ticketType: "PAIR",
              });
            }
            // Support legacy NA key
            if (eventCart["NA"] && eventCart["NA"] > 0) {
              tickets.push({
                ...item,
                quantity: eventCart["NA"],
                ticketType: "SINGLE",
              });
            }
            if (tickets.length > 0) {
              updatedCart.events[item.id] = tickets;
            }
          }
        });
      }

      setCartItems(updatedCart);
      setIsLoading(false);
    };

    // Initial load
    updateCartFromStorage();

    // Listen for storage changes
    window.addEventListener("storage", updateCartFromStorage);

    return () => {
      window.removeEventListener("storage", updateCartFromStorage);
    };
  }, [merch_items, event_items]);

  const updateLocalStorage = (updatedCart: any) => {
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const handleQuantityChange = (
    item: any,
    action: "increase" | "decrease",
    isMerch: boolean
  ) => {
    const updatedCart = { ...cartItems };
    const cart = JSON.parse(localStorage.getItem("cart") || "{}") || {};

    if (isMerch) {
      const itemId = item.id;

      if (!cart[itemId]) {
        cart[itemId] = {};
      }
      const updatedItem = updatedCart.merch[itemId].map((merch) =>
        merch.size === item.size
          ? {
              ...merch,
              quantity:
                action === "increase"
                  ? merch.quantity + 1
                  : Math.max(1, merch.quantity - 1),
            }
          : merch
      );
      if (action === "decrease" && item.quantity <= 1) {
        delete cart[itemId][item.size];
        if (Object.keys(cart[itemId]).length === 0) {
          delete cart[itemId];
        }
        updatedCart.merch[itemId] = updatedCart.merch[itemId].filter(
          (merch) => merch.size !== item.size
        );
        if (updatedCart.merch[itemId].length === 0) {
          delete updatedCart.merch[itemId];
        }
      } else {
        updatedCart.merch[itemId] = updatedItem;
        cart[itemId] = updatedItem.reduce((acc: any, curr: any) => {
          acc[curr.size] = curr.quantity;
          return acc;
        }, {});
      }
    } else {
      // Handle events with ticketType
      const itemId = item.id;
      const ticketType = item.ticketType || "SINGLE";
      
      const updatedItem = updatedCart.events[itemId].map((event) =>
        event.ticketType === ticketType
          ? {
              ...event,
              quantity:
                action === "increase"
                  ? event.quantity + 1
                  : Math.max(0, event.quantity - 1),
            }
          : event
      );
      
      // Remove tickets with 0 quantity
      const filteredItem = updatedItem.filter((event) => event.quantity > 0);
      
      if (filteredItem.length === 0) {
        delete cart[itemId];
        delete updatedCart.events[itemId];
      } else {
        updatedCart.events[itemId] = filteredItem;
        // Update cart storage
        cart[itemId] = filteredItem.reduce((acc: any, curr: any) => {
          acc[curr.ticketType] = curr.quantity;
          return acc;
        }, {});
      }
    }
    updateLocalStorage(cart);
    setCartItems(updatedCart);
  };

  if (isLoading) {
    return <div className="text-center text-xl">Your cart is loading...</div>;
  }

  const allCartItems = [
    ...Object.values(cartItems.merch).flat(),
    ...Object.values(cartItems.events).flat(),
  ];

  // ACCOMMODATION DISABLED - Changed condition
  if (allCartItems.length === 0 && !needsAccommodation) {
    return (
      <div className="mt-10">
        <div className="mb-6 text-center flex flex-col items-center">
          <label className="block text-lg font-semibold mb-3 text-white">
            Do you need accommodation? (Only for external students!)
          </label>
          <select
            className="w-full max-w-xs p-3 border-2 border-white/30 rounded-lg bg-white/10 backdrop-blur-sm text-white font-medium cursor-pointer hover:bg-white/20 transition-all focus:outline-none focus:border-[#ffbc00] focus:ring-2 focus:ring-[#ffbc00]/50"
            onChange={(e) => {
              setNeedsAccommodation(e.target.value === "yes");
            }}
          >
            <option value="no" className="bg-[#8200C1] text-white">
              No
            </option>
            <option value="yes" className="bg-[#8200C1] text-white">
              Yes
            </option>
          </select>
        </div>
        <Image
          src="/images/empty-cart-2.png"
          alt="Not Found"
          width={275}
          height={275}
          className="mt-10 mx-auto"
        />
        <p className="mt-8 text-center font-semibold text-xl">
          Your Cart is empty
        </p>
        <p className="text-center mt-2 text-muted-foreground">
          Looks like you have not added anything to your cart. Go{" "}
        </p>
        <p className="text-center text-muted-foreground">
          ahead and explore our offerings!
        </p>
        <div className="py-10"></div>
      </div>
    );
  }

  const calculateGrandTotal = () => {
    const itemsTotal = allCartItems.reduce((acc, item) => {
      if ("product_price" in item) {
        return acc + item.product_price * item.quantity;
      }
      if ("event_price" in item && "ticketType" in item) {
        const price = item.ticketType === "PAIR" ? (item.event_pair_price || 0) : item.event_price;
        return acc + price * item.quantity;
      }
      return acc;
    }, 0);

    let num_days = 0;
    selectedDays.forEach((day) => (num_days += day ? 1 : 0));
    const accommodationPrice = (() => {
      switch (num_days) {
        case 1:
          return 649;
        case 2:
          return 1099;
        case 3:
          return 1499;
        default:
          return 0;
      }
    })();
    return itemsTotal + accommodationPrice;
  };

  return (
    <div className="pt-5 min-h-screen">
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-6 px-2">
          <label className="block text-lg font-semibold mb-3 text-white">
            Do you need accommodation? (Only for external students!)
          </label>
          <select
            className="w-full max-w-xs p-3 border-2 border-white/30 rounded-lg bg-white/10 backdrop-blur-sm text-white font-medium cursor-pointer hover:bg-white/20 transition-all focus:outline-none focus:border-[#ffbc00] focus:ring-2 focus:ring-[#ffbc00]/50"
            onChange={(e) => {
              setNeedsAccommodation(e.target.value === "yes");
            }}
            value={needsAccommodation ? "yes" : "no"}
          >
            <option value="no" className="bg-[#8200C1] text-white">
              No
            </option>
            <option value="yes" className="bg-[#8200C1] text-white">
              Yes
            </option>
          </select>

          {needsAccommodation && (
            <div className="mt-4 space-y-2">
              <label className="block text-sm font-medium mb-2">
                Select days:
              </label>
              <div className="flex flex-col space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="day1"
                    checked={selectedDays[0]}
                    onCheckedChange={(checked) =>
                      setSelectedDays((prev) => {
                        prev[0] = checked === true;
                        return [...prev];
                      })
                    }
                  />
                  <label
                    htmlFor="day1"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Day 1 (20th February)
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="day2"
                    checked={selectedDays[1]}
                    onCheckedChange={(checked) =>
                      setSelectedDays((prev) => {
                        prev[1] = checked === true;
                        return [...prev];
                      })
                    }
                  />
                  <label
                    htmlFor="day2"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Day 2 (21st February)
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="day3"
                    checked={selectedDays[2]}
                    onCheckedChange={(checked) =>
                      setSelectedDays((prev) => {
                        prev[2] = checked === true;
                        return [...prev];
                      })
                    }
                  />
                  <label
                    htmlFor="day3"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Day 3 (22nd February)
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Merch Items */}
        {Object.entries(cartItems.merch).map(([itemId, sizeVariants]) =>
          sizeVariants.map((item) => (
            <div
              key={`${itemId}-${item.size}`}
              className="flex items-center justify-between p-2 mb-2 shadow-lg rounded-lg border-2 hover:shadow-xl transition-all sm:p-4 sm:mb-4"
            >
              <div className="flex flex-col flex-grow">
                <h3 className="text-sm sm:text-xl font-semibold truncate">
                  {item.product_name}
                </h3>
                <p className="text-xs sm:text-base text-muted-foreground">
                  ₹{item.product_price}
                </p>
                <p className="text-xs sm:text-base text-muted-foreground">
                  Size: {item.size}
                </p>
              </div>

              <div className="flex items-center space-x-2 mt-2 sm:mt-0">
                <div className="flex items-center space-x-2">
                  <button
                    className="px-2 py-1 border rounded-md text-xs sm:text-sm hover:text-muted-foreground"
                    onClick={() => handleQuantityChange(item, "decrease", true)}
                    aria-label={`Decrease quantity of ${item.product_name}`}
                  >
                    -
                  </button>
                  <span className="text-xs sm:text-sm">{item.quantity}</span>
                  <button
                    className="px-2 py-1 border rounded-md text-xs sm:text-sm hover:text-muted-foreground"
                    onClick={() => handleQuantityChange(item, "increase", true)}
                    aria-label={`Increase quantity of ${item.product_name}`}
                  >
                    +
                  </button>
                </div>

                <div className="font-semibold text-xs sm:text-lg">
                  ₹{item.product_price * item.quantity}
                </div>
              </div>
            </div>
          ))
        )}

        {/* Event Items */}
        {Object.entries(cartItems.events).map(([eventId, ticketVariants]) =>
          ticketVariants.map((item) => (
            <div
              key={`${eventId}-${item.ticketType}`}
              className="flex items-center justify-between p-2 mb-2 shadow-lg rounded-lg border-2 hover:shadow-xl transition-all sm:p-4 sm:mb-4"
            >
              <div className="flex flex-col flex-grow">
                <h3 className="text-sm sm:text-xl font-semibold truncate">
                  {item.event_name}
                </h3>
                <p className="text-xs sm:text-base text-muted-foreground">
                  {item.ticketType === "PAIR" ? "Pair Ticket" : "Single Ticket"} - ₹{item.ticketType === "PAIR" ? item.event_pair_price : item.event_price}
                </p>
              </div>

              <div className="flex items-center space-x-2 mt-2 sm:mt-0">
                <div className="flex items-center space-x-2">
                  <button
                    className="px-2 py-1 border rounded-md text-xs sm:text-sm hover:text-muted-foreground"
                    onClick={() => handleQuantityChange(item, "decrease", false)}
                    aria-label={`Decrease quantity of ${item.event_name}`}
                  >
                    -
                  </button>
                  <span className="text-xs sm:text-sm">{item.quantity}</span>
                  <button
                    className="px-2 py-1 border rounded-md text-xs sm:text-sm hover:text-muted-foreground"
                    onClick={() => handleQuantityChange(item, "increase", false)}
                    aria-label={`Increase quantity of ${item.event_name}`}
                  >
                    +
                  </button>
                </div>

                <div className="font-semibold text-xs sm:text-lg">
                  ₹{(item.ticketType === "PAIR" ? (item.event_pair_price || 0) : item.event_price) * item.quantity}
                </div>
              </div>
            </div>
          ))
        )}
        <div className="mt-10 border-t border-secondary-foreground pt-4 pb-6">
          <div className="text-right text-lg sm:text-xl font-bold">
            Grand Total: ₹{calculateGrandTotal()}
          </div>
          <div className="flex justify-center mt-8">
            <CheckoutButton accommodation={selectedDays} />
          </div>
        </div>
      </div>
    </div>
  );
}
