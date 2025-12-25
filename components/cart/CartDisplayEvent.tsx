'use client';
import { EventItem } from '@prisma/client';
import { useEffect, useState } from 'react';

export default function CartDisplayEvent({ items }: { items: EventItem[] }) {
  const [cartItems, setCartItems] = useState<{
    [key: string]: EventItem & { quantity: number };
  }>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const updateCartFromStorage = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '{}');
      const cartWithDetails: {
        [key: string]: EventItem & { quantity: number };
      } = {};

      items.forEach((item) => {
        if (cart[item.id]?.['NA']) {
          cartWithDetails[item.id] = {
            ...item,
            quantity: cart[item.id]['NA'],
          };
        }
      });

      setCartItems(cartWithDetails);
    };

    updateCartFromStorage();
    setIsLoading(false);

    window.addEventListener('storage', updateCartFromStorage);
    return () => window.removeEventListener('storage', updateCartFromStorage);
  }, [items]);

  if (isLoading) {
    return <div className="text-center text-xl">Your cart is loading...</div>;
  }

  if (Object.keys(cartItems).length === 0) {
    return (
      <div className="text-center text-xl">
        You have no event tickets in your cart!
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      {Object.values(cartItems).map((item) => (
        <div
          key={item.id}
          className="flex items-center justify-between border-b py-4"
        >
          <div>
            <h3 className="text-lg font-semibold">{item.event_name}</h3>
            <p className="text-gray-600">₹{item.event_price}</p>
          </div>
          <div className="flex items-center">
            <span className="mx-4">Tickets: {item.quantity}</span>
            <span className="font-semibold">
              Total: ₹{Number(item.event_price) * item.quantity}
            </span>
          </div>
        </div>
      ))}
      <div className="mt-6 text-right text-xl font-bold">
        Total: ₹
        {Object.values(cartItems).reduce(
          (acc, item) => acc + Number(item.event_price) * item.quantity,
          0
        )}
      </div>
    </div>
  );
}
