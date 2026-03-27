import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FutureWealth — Your Financial Life, Reimagined",
  description:
    "AI-powered financial life planning that goes beyond the numbers. Discover your human capital, measure what makes you happy, and write a positive financial future.",
  keywords: ["financial planning", "wealth management", "human capital", "happiness", "retirement planning"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="antialiased">
      <body className="min-h-screen bg-midnight text-slate-200 font-sans">
        {children}
      </body>
    </html>
  );
}
