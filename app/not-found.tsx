"use client"

import { useSearchParams } from "next/navigation"
import PageContent from "../components/PageContent"

export default function NotFound() {
  // Get URL parameters
  const searchParams = useSearchParams()
  const urlReferer = searchParams.get("referer") || ""

  // Get header referer if available
  let headerReferer = ""
  if (typeof window !== "undefined") {
    headerReferer = document.referrer || ""
  }

  // Prioritize URL referer over header referer
  const referer = urlReferer || headerReferer

  // Log all URL parameters for debugging
  console.log(
    "Not Found Page - URL Parameters:",
    Array.from(searchParams.entries()).reduce((obj, [key, value]) => {
      obj[key] = value
      return obj
    }, {} as Record<string, string>)
  )

  return <PageContent referrer={referer} />
}
