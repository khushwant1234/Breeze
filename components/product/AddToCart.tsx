"use client";

import { useState, useEffect } from "react";
import { useSizeContext } from "./SizeSelector";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

export const AddToCartMerch = ({ merch_id }: { merch_id: string }) => {
  const { selectedSize } = useSizeContext();
  const [quantity, setQuantity] = useState(0);

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart") || "{}");
    if (cart[merch_id]?.[selectedSize]) {
      setQuantity(cart[merch_id][selectedSize]);
    } else {
      setQuantity(0);
    }
  }, [merch_id, selectedSize]);

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Please select a size before adding to the cart!");
      return;
    }

    const cart = JSON.parse(localStorage.getItem("cart") || "{}");
    if (!cart[merch_id]) {
      cart[merch_id] = {};
    }
    cart[merch_id][selectedSize] = (cart[merch_id][selectedSize] || 0) + 1;
    localStorage.setItem("cart", JSON.stringify(cart));
    setQuantity(cart[merch_id][selectedSize]);
  };

  const handleRemoveFromCart = () => {
    if (!selectedSize) return;

    const cart = JSON.parse(localStorage.getItem("cart") || "{}");
    if (cart[merch_id]?.[selectedSize] > 1) {
      cart[merch_id][selectedSize] -= 1;
    } else {
      delete cart[merch_id][selectedSize];
      if (Object.keys(cart[merch_id]).length === 0) {
        delete cart[merch_id];
      }
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    setQuantity(cart[merch_id]?.[selectedSize] || 0);
  };

  return (
    <div className="mt-8 flex space-x-4 items-center">
      {quantity > 0 ? (
        <>
          <button
            className="w-[40px] h-[40px] sm:w-[40px] sm:h-[40px] bg-black text-white font-semibold rounded-lg"
            onClick={handleRemoveFromCart}
          >
            -
          </button>
          <span>{quantity}</span>
          <button
            className="w-[40px] h-[40px] sm:w-[40px] sm:h-[40px] bg-black text-white font-semibold rounded-lg"
            onClick={handleAddToCart}
          >
            +
          </button>
        </>
      ) : (
        <button
          className=" sm:w-[200px] text-[16px] sm:h-[50px] h-[10vw] bg-black text-white font-semibold rounded-lg  w-[30vw]"
          onClick={handleAddToCart}
        >
          Buy Now
        </button>
      )}
    </div>
  );
};

export const AddToCartEvent = ({ event_id }: { event_id: string }) => {
  const [quantity, setQuantity] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart") || "{}");
    setQuantity(cart[event_id]?.["NA"] || 0);
  }, [event_id]);

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "{}");
    if (!cart[event_id]) {
      cart[event_id] = {};
    }
    cart[event_id]["NA"] = (cart[event_id]["NA"] || 0) + 1;
    localStorage.setItem("cart", JSON.stringify(cart));
    setQuantity(cart[event_id]["NA"]);
  };

  const handleRemoveFromCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "{}");
    if (cart[event_id]?.["NA"] > 1) {
      cart[event_id]["NA"] -= 1;
    } else {
      delete cart[event_id];
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    setQuantity(cart[event_id]?.["NA"] || 0);
  };

  return (
    <div className="mt-8 flex flex-col space-y-4 items-center">
      {quantity > 0 ? (
        <>
          <div className="flex space-x-4 items-center">
            <Button
              className="w-[8vw] h-[8vw] sm:w-[4vw] sm:h-[4vw] font-semibold rounded-lg"
              onClick={handleRemoveFromCart}
            >
              -
            </Button>
            <span className="text-xl font-semibold">{quantity}</span>
            <Button
              className="w-[8vw] h-[8vw] sm:w-[4vw] sm:h-[4vw] font-semibold rounded-lg"
              onClick={handleAddToCart}
            >
              +
            </Button>
          </div>
          <Button
            className="sm:w-[15vw] sm:text-[1.2vw] sm:h-[4vw] h-[10vw] font-semibold rounded-lg text-[3vw] w-[40vw]"
            onClick={() => router.push("/cart")}
            variant="outline"
          >
            Go to Cart →
          </Button>
        </>
      ) : (
        <Button
          className="sm:w-[15vw] sm:text-[1.5vw] sm:h-[4vw] h-[10vw] font-semibold rounded-lg text-[3vw] w-[30vw]"
          onClick={handleAddToCart}
        >
          Add to Cart
        </Button>
      )}
    </div>
  );
};
