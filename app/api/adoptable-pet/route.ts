import { Pet } from "@/lib/types"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const zipCode = searchParams.get("zipCode")
  const apiKey = process.env.RESCUEGROUPS_API_KEY

  if (!apiKey) {
    console.error("API key not configured")
    return NextResponse.json({ error: "API key not configured" }, { status: 500 })
  }

  try {
    const requestBody = JSON.stringify({
      data: {
        filterRadius: {
          miles: 100,
          postalcode: zipCode || "10001",
        },
        sort: [
          {
            fieldName: "random",
            order: "DESC",
          },
        ],
        fields: {
          animals: ["name", "ageString", "breedString", "descriptionText", "pictureThumbnailUrl", "url"],
          pictures: ["original"],
        },
        include: ["pictures"],
        limit: 100,
      },
    })

    const response = await fetch("https://api.rescuegroups.org/v5/public/animals/search/available", {
      method: "POST",
      headers: {
        "Content-Type": "application/vnd.api+json",
        Authorization: apiKey,
      },
      body: requestBody,
    })

    if (!response.ok) {
    const errorText = await response.text();
    console.error("API Response Error:", {
      status: response.status,
      statusText: response.statusText,
      body: errorText,
      })
      return NextResponse.json({ error: "Failed to fetch pets. Please try again later." }, { status: response.status })
    }

    const data = await response.json()
    if (!data.data || data.data.length === 0) {
      console.error("No pets found in response:", data)
      return NextResponse.json({ error: "No pets found" }, { status: 404 })
    }

    // Filter animals to only include those with pictures
    const petsWithPictures = data.data.filter(
      (pet: Pet) =>
        pet.relationships &&
        pet.relationships.pictures &&
        pet.relationships.pictures.data &&
        pet.relationships.pictures.data.length > 0,
    )

    if (petsWithPictures.length === 0) {
      console.error("No pets with pictures found")
      return NextResponse.json({ error: "No pets with pictures found" }, { status: 404 })
    }

    // Limit the number of pets returned to 25
    const limitedPets = petsWithPictures.slice(0, 25)

    return NextResponse.json({
      data: limitedPets,
      included: data.included,
    })
  } catch (error) {
    console.error("Error in adoptable-pet route:", error)
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again later." },
    { status: 500 },
  );
}
}

