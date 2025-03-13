import { Analytics } from "@vercel/analytics/react"
import { Inter } from "next/font/google"
import type React from "react"
import Footer from "./components/Footer"
import "./globals.css"
const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "404 Love Found",
  description: "Find love when you're lost",
  icons: {
    icon: "/favicon.ico",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-400 p-4">
          <main className="flex-grow flex flex-col items-center justify-center w-full">
            {children}
          </main>

          <Footer />
        </div>
        <Analytics />
      </body>
    </html>
  )
}
