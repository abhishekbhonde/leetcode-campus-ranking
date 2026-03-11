import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

export const metadata: Metadata = {
  title: "LeetCode Campus Leaderboard",
  description:
    "Compete with your college peers on LeetCode. Track your progress and climb the rankings.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${geist.variable} font-sans antialiased bg-gray-950 text-white min-h-screen`}>
        <AuthProvider>
          <Navbar />
          <main className="pt-16">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
