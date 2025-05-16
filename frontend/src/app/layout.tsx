import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SmartPark",
  description: "Automated Parking with Unique Payment Technique",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
