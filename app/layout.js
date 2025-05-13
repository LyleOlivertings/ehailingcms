
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

import { Toaster } from 'react-hot-toast';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Cape Rides",
  description: "Driver CMS",
};

export default function DashboardLayout({ children }) {
  return (
    <html lang="en">
      <body>
      
        <div className="min-h-screen bg-gray-100">
          <div className="flex">
            <div className="w-64 bg-white shadow-md min-h-screen p-4">
              <div className="mb-8">
                <h1 className="text-xl font-bold text-gray-800">Cape Rides</h1>
                <p className="text-sm text-gray-500">Driver CMS</p>
              </div>
              <nav className="space-y-2">
                <Link href="/dashboard" className="block p-2 hover:bg-gray-100 rounded">Dashboard</Link>
                <Link href="/rides" className="block p-2 hover:bg-gray-100 rounded">Rides</Link>
                <Link href="/customers" className="block p-2 hover:bg-gray-100 rounded">Customers</Link>
                <Link href="/new-ride" className="block p-2 hover:bg-gray-100 rounded">New Ride</Link>
              </nav>
            </div>

            <main className="flex-1 p-8">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}