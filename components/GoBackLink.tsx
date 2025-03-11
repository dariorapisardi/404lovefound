"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"

interface GoBackLinkProps {
  referrer: string
}

export default function GoBackLink({ referrer }: GoBackLinkProps) {
  const router = useRouter()

  const handleClick = (e: React.MouseEvent) => {
    if (!referrer) {
      e.preventDefault()
      router.back()
    }
  }

  return (
    <Link
      href={referrer || "/"}
      onClick={handleClick}
      className="inline-flex items-center bg-gradient-to-r from-pink-500 to-yellow-500 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out hover:from-pink-600 hover:to-yellow-600"
    >
      <ArrowLeft className="mr-2" size={20} />
      Go back
    </Link>
  )
}
