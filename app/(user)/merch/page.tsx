import CardSection from "@/components/merch-2024/CardSection";
import BottomSection from "@/components/merch-2024/BottomSection";
import Heading from "@/components/merch-2024/Heading";
import { Metadata } from "next";

export const metadata = {
  title: "Merch - Breeze '25",
  description: "Merch Store",
};
export default function page() {
  return (
    <div>
      <section className="relative h-screen">
        {/* Pseudo-element with the blurred background */}
        <div className="absolute inset-0 bg-[url('/images/Merch-hero.png')] bg-cover bg-center bg-no-repeat"></div>
        {/* Content on top of the blurred background */}
      </section>
      <Heading></Heading>
      <CardSection></CardSection>
      <BottomSection></BottomSection>
    </div>
  );
}
