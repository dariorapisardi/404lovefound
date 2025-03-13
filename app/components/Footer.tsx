"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Footer() {
  const pathname = usePathname()
  const isAboutPage = pathname === "/about"

  return (
    <footer className="text-center text-sm text-gray-600 py-4 w-full flex justify-end">
      <div>
        {isAboutPage ? (
          <Link href="/">Home</Link>
        ) : (
          <Link href="/about">About</Link>
        )}{" "}
        | <a href="https://github.com/dariorapisardi/404lovefound">GitHub</a>
      </div>
    </footer>
  )
}
