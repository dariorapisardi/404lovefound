"use client"

import AdoptablePet from "./AdoptablePet"
import GoBackLink from "./GoBackLink"

interface PageContentProps {
  referrer: string
}

export default function PageContent({ referrer }: PageContentProps) {
  // Log the referrer for debugging purposes
  console.log("PageContent received referrer:", referrer)

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
        <GoBackLink referrer={referrer} />
      </div>
    </div>
  )
}
