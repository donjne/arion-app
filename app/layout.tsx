import "./globals.css";
import type { Metadata } from "next";
import { Inter, Cinzel } from "next/font/google";
import { Providers } from "./providers";

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
});

const cinzel = Cinzel({ 
  subsets: ["latin"],
  variable: '--font-cinzel',
  weight: ['400', '500', '600', '700']
});

export const metadata: Metadata = {
  title: "Arion - Privacy-Preserving DeFi",
  description: "Earn yield on your ZCash privately with Arion",
  keywords: "ZCash, DeFi, Privacy, Aave, Yield",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${cinzel.variable}`}>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}