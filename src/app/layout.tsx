"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import { MainSideBar } from "./(home)/_components/main-siderbar";
const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex h-screen`}>
        <main className="w-full h-screen">{children}</main>
      </body>
    </html>
  );
}
