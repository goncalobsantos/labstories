import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  title: "LabStories — Building Our Story",
  description:
    "LabStories is a creative studio specialising in events, weddings, people, and brand content. Based in Portugal.",
  openGraph: {
    title: "LabStories — Building Our Story",
    description:
      "Creative studio specialising in events, weddings, people, and brand content.",
    url: "https://labstories.pt",
    siteName: "LabStories",
    locale: "en_GB",
    type: "website",
  },
  metadataBase: new URL("https://labstories.pt"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
