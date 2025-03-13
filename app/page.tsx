import { headers } from "next/headers"
import { notFound } from "next/navigation"
import PageContent from "../components/PageContent"

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const headersList = await headers()
  const headerReferer = headersList.get("referer") || ""
  const params = await searchParams
  const referer = params.referer?.toString() || headerReferer

  // Check if the nf parameter is true to return a 404 status code
  const shouldReturn404 = params.nf === "true"

  // If nf=true, use Next.js notFound() to return a 404 status code
  // while still rendering our custom content
  if (shouldReturn404) {
    // Next.js automatically preserves the URL parameters when calling notFound()
    notFound()
  }

  return <PageContent referrer={referer} />
}
