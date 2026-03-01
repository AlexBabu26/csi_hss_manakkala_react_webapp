import type { Metadata } from "next";
import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SkipNavigation from "../components/SkipNavigation";
import Providers from "../components/Providers";

export const metadata: Metadata = {
  title: "CSI HSS For The Partially Hearing, Manakala",
  description: "Official website for the CSI Higher Secondary School For The Partially Hearing in Manakala.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen flex flex-col">
        <Providers>
          <SkipNavigation />
          <Header />
          <main id="main-content" className="flex-grow">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
