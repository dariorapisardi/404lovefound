import { headers } from "next/headers"
import AdoptablePet from "../components/AdoptablePet"
import GoBackLink from "../components/GoBackLink"

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const headersList = await headers()
  const headerReferer = headersList.get("referer") || ""
  const params = await searchParams
  const referer = params.referer?.toString() || headerReferer
  return (
    <div className="w-full max-w-4xl">
      <h1 className="text-4xl font-bold mb-6 text-center text-white drop-shadow-lg">
        404 Love Found
      </h1>
      <p className="text-xl mb-8 text-white drop-shadow-lg text-center">
        The page you&apos;re looking for doesn&apos;t exist, but love is always
        around the corner!
      </p>
      <AdoptablePet />
      <div className="flex flex-col items-center h-4"></div>
      <div className="flex justify-center w-full">
        <GoBackLink referrer={referer} />
      </div>
    </div>
  )
}
