import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import clsx from "clsx";
import { SceneBackground } from "@/components/layout/SceneBackground";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Burgundy Ventures | Custom Digital Artifacts",
  description: "We make your point A->B in the metaverse risk and stress free.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={clsx(
          inter.variable,
          spaceGrotesk.variable,
          "font-sans antialiased bg-void text-white selection:bg-neon-purple/30"
        )}
      >
        <SceneBackground />
        {children}
      </body>
    </html>
  );
}
