import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navigation from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import "./globals.css";
import AnimeSearchMobileWrapper from "@/app/search/AnimeSearchMobileWrapper";
import { SearchToggleProvider } from "@/context/SearchToggleContext";
import ScrollToTop from "@/components/ScrollToTop";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// app/layout.tsx
export const metadata: Metadata = {
  title: {
    default: "OtakuList — Anime Catalogue for Indian Fans",
    template: "%s | OtakuList",
  },
  description: "Browse top anime, seasonal charts, airing schedules in Indian Standard Time (IST), genres and more. Built for Indian anime fans.",
  keywords: ["anime", "anime schedule", "anime IST", "anime India", "top anime", "seasonal anime", "jikan", "myanimelist"],
  metadataBase: new URL("https://av-otakulist.vercel.app"),
  openGraph: {
    siteName: "OtakuList",
    type: "website",
    locale: "en_IN",
  },
  verification: {
    google:"ntgtRLiU_NAPwiCyxFiuy3fQ3_wVKvUF3Gbl7mdAeTw"
  }
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning >
      <body
        className={`${geistSans.variable} ${geistMono.variable}  antialiased flex flex-col min-h-screen box-border`}
      >
        <SearchToggleProvider>

          <Navigation />
          <main>
            <AnimeSearchMobileWrapper />
            {children}
            <ScrollToTop />
          </main>
          <Footer />
        </SearchToggleProvider>
      </body>
    </html>
  );
}