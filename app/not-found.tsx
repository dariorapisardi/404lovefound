"use client"

import { useSearchParams } from "next/navigation"
import { Suspense } from "react"
import PageContent from "../components/PageContent"

// Client component that uses useSearchParams
function NotFoundContent() {
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

  return <PageContent referrer={referer} />
}

// Main NotFound component with Suspense boundary
export default function NotFound() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NotFoundContent />
    </Suspense>
  )
}
