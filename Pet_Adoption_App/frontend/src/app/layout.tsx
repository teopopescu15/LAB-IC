import { Inter } from "next/font/google";
import "./globals.css"; // This is the key import for Tailwind
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Hero from "./components/home/Hero";
const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        <main className="min-h-screen p-4">{children}</main>

        <Footer />
      </body>
    </html>
  );
}
