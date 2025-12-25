import type { Metadata } from "next";
import ClientLayout from "./ClientLayout";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: "Home - Breeze '25",
  description: "Breeze 2025 Homepage",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <ClientLayout>{children}</ClientLayout>
    </ThemeProvider>
  );
}
