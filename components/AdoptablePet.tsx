"use client"

import type { Pet } from "@/lib/types"
import { AnimatePresence, motion } from "framer-motion"
import { AlertCircle, ChevronLeft, ChevronRight, MapPin } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import type React from "react"
import { useCallback, useEffect, useState } from "react"
import { useSwipeable } from "react-swipeable"
import { getRandomZipCode } from "../lib/zipCodes"

interface Picture {
  id: string
  attributes: {
    original: {
      url: string
    }
  }
}

interface ZipCodeFormProps {
  zipCode: string
  zipCodeError: string | null
  onZipCodeChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  buttonText?: string
  className?: string
  showLabel?: boolean
}

function ZipCodeForm({
  zipCode,
  zipCodeError,
  onZipCodeChange,
  onSubmit,
  buttonText = "Update",
  className = "",
  showLabel = false,
}: ZipCodeFormProps) {
  return (
    <form onSubmit={onSubmit} className={`flex flex-col gap-2 ${className}`}>
      {showLabel && (
        <p className="text-gray-600 mb-2">
          Try searching in a different location (US Zip Code):
        </p>
      )}
      <div className="flex items-center bg-gray-100 rounded-full p-2">
        <MapPin className="text-gray-400 ml-2" size={20} />
        <input
          type="text"
          value={zipCode}
          onChange={onZipCodeChange}
          placeholder="Enter US ZIP code"
          className="bg-transparent border-none focus:ring-0 flex-grow px-3 py-1 w-20"
          maxLength={5}
        />
        <button
          type="submit"
          className="bg-gradient-to-r from-pink-500 to-yellow-500 text-white font-bold py-2 px-4 rounded-full"
          aria-label={`${buttonText} zip code search`}
        >
          {buttonText}
        </button>
      </div>
      {zipCodeError && (
        <p className="text-red-500 text-sm text-center">{zipCodeError}</p>
      )}
    </form>
  )
}

export default function AdoptablePet() {
  const [pets, setPets] = useState<Pet[]>([])
  const [pictures, setPictures] = useState<{ [key: string]: Picture }>({})
  const [currentPetIndex, setCurrentPetIndex] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [zipCode, setZipCode] = useState<string>("")
  const [zipCodeError, setZipCodeError] = useState<string | null>(null)

  const isValidUSZipCode = (zipCode: string): boolean => {
    return /^\d{5}(-\d{4})?$/.test(zipCode)
  }

  const fetchUserLocation = useCallback(async () => {
    try {
      const response = await fetch("https://freeipapi.com/api/json")
      const data = await response.json()
      return data.zipCode || null
    } catch (error) {
      console.error("Error fetching user location:", error)
      return null
    }
  }, [])

  const fetchPets = useCallback(async (zip: string) => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch(`/api/adoptable-pet?zipCode=${zip}`)
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        )
      }
      const data = await response.json()
      if (!data.data || !Array.isArray(data.data) || data.data.length === 0) {
        throw new Error("No pets data received")
      }
      // Filter out pets without valid URLs
      const validPets = data.data.filter(
        (pet: Pet) => pet.attributes.url && pet.attributes.url.trim() !== ""
      )
      setPets(validPets)
      const picturesMap: { [key: string]: Picture } = {}
      if (data.included && Array.isArray(data.included)) {
        data.included.forEach(
          (item: {
            type: string
            id: string
            attributes: { original: { url: string } }
          }) => {
            if (item.type === "pictures") {
              picturesMap[item.id] = item
            }
          }
        )
      }
      setPictures(picturesMap)
    } catch (error) {
      console.error("Error fetching adoptable pets:", error)
      setError(
        error instanceof Error ? error.message : "An unknown error occurred"
      )
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    const initializePets = async () => {
      let zip = await fetchUserLocation()
      if (!zip) {
        zip = getRandomZipCode()
      }
      setZipCode(zip)
      fetchPets(zip)
    }
    initializePets()
  }, [fetchPets, fetchUserLocation])

  const handleZipCodeSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setZipCodeError(null)

    if (!isValidUSZipCode(zipCode)) {
      setZipCodeError("Please enter a valid 5-digit ZIP code")
      return
    }

    fetchPets(zipCode)
  }

  const handleZipCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.slice(0, 5) // Limit to 5 digits
    setZipCode(value.replace(/[^\d]/g, "")) // Only allow digits
    setZipCodeError(null)
  }

  const handleSwipe = (direction: "left" | "right") => {
    if (direction === "left") {
      setCurrentPetIndex((prevIndex) => (prevIndex + 1) % pets.length)
    } else {
      setCurrentPetIndex(
        (prevIndex) => (prevIndex - 1 + pets.length) % pets.length
      )
    }
  }

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => handleSwipe("left"),
    onSwipedRight: () => handleSwipe("right"),
    preventScrollOnSwipe: true,
    trackMouse: true,
  })

  if (isLoading) {
    return (
      <div className="bg-white rounded-3xl shadow-lg p-8 text-center">
        <div className="animate-pulse">
          <div className="rounded-3xl bg-gray-200 h-96 w-full mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
        </div>
        <p className="text-gray-600 mt-4">Finding your perfect match...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-3xl shadow-lg p-8 text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <p className="text-gray-800 mb-4">Oops! Something went wrong.</p>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={() => fetchPets(zipCode)}
          className="bg-gradient-to-r from-pink-500 to-yellow-500 text-white font-bold py-2 px-6 rounded-full transition duration-300 ease-in-out hover:from-pink-600 hover:to-yellow-600"
          aria-label="Try fetching pets again"
        >
          Try Again
        </button>
      </div>
    )
  }

  if (pets.length === 0) {
    return (
      <div className="bg-white rounded-3xl shadow-lg p-8 text-center">
        <p className="text-gray-800 mb-4">No pets found at the moment.</p>

        <ZipCodeForm
          zipCode={zipCode}
          zipCodeError={zipCodeError}
          onZipCodeChange={handleZipCodeChange}
          onSubmit={handleZipCodeSubmit}
          buttonText="Search"
          className="max-w-md mx-auto mb-4"
          showLabel={true}
        />
      </div>
    )
  }

  const currentPet = pets[currentPetIndex]
  const petPicture = currentPet.relationships.pictures.data[0]
  const pictureUrl =
    petPicture && pictures[petPicture.id]
      ? pictures[petPicture.id].attributes.original.url
      : currentPet.attributes.pictureThumbnailUrl || "/placeholder.svg"

  const decodeHtmlEntities = (text: string) => {
    const textArea = document.createElement("textarea")
    textArea.innerHTML = text
    return textArea.value
  }

  return (
    <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
      <div className="relative h-96 md:h-[32rem]" {...swipeHandlers}>
        <AnimatePresence>
          <motion.div
            key={currentPet.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
          >
            <div className="absolute inset-0">
              <Image
                src={pictureUrl || "/placeholder.svg"}
                alt="background"
                fill
                className="object-fill"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
            </div>
            <Image
              src={pictureUrl || "/placeholder.svg"}
              alt={currentPet.attributes.name}
              fill
              className="object-scale-down"
              priority
            />
          </motion.div>
        </AnimatePresence>
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white [text-shadow:_0_1px_12px_rgb(0_0_0_/_50%)]">
          <h2 className="text-3xl font-bold mb-2">
            {currentPet.attributes.name}, {currentPet.attributes.ageString}
          </h2>
          <p className="text-lg mb-2">{currentPet.attributes.breedString}</p>
          <p className="text-sm line-clamp-2">
            {decodeHtmlEntities(currentPet.attributes.descriptionText)}
          </p>
        </div>
      </div>
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => handleSwipe("right")}
            className="bg-white text-pink-500 border-2 border-pink-500 rounded-full p-3 transition duration-300 ease-in-out hover:bg-pink-100"
            aria-label="Previous pet"
          >
            <ChevronLeft size={24} />
          </button>
          <Link
            href={currentPet.attributes.url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gradient-to-r from-pink-500 to-yellow-500 text-white font-bold py-3 px-6 rounded-full transition duration-300 ease-in-out hover:from-pink-600 hover:to-yellow-600"
            aria-label={`View adoption details for ${currentPet.attributes.name}`}
          >
            Go check {currentPet.attributes.name}
          </Link>
          <button
            onClick={() => handleSwipe("left")}
            className="bg-white text-pink-500 border-2 border-pink-500 rounded-full p-3 transition duration-300 ease-in-out hover:bg-pink-100"
            aria-label="Next pet"
          >
            <ChevronRight size={24} />
          </button>
        </div>
        <ZipCodeForm
          zipCode={zipCode}
          zipCodeError={zipCodeError}
          onZipCodeChange={handleZipCodeChange}
          onSubmit={handleZipCodeSubmit}
        />
      </div>
    </div>
  )
}
