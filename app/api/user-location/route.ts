import { headers } from "next/headers"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const headersList = await headers()
    
    // Cloudflare provides these headers for IP geolocation
    // Headers are case-insensitive in Next.js, but Cloudflare uses CF-IP* format
    const country = headersList.get("cf-ipcountry") || headersList.get("CF-IPCountry")
    const latitude = headersList.get("cf-iplatitude") || headersList.get("CF-IPLatitude")
    const longitude = headersList.get("cf-iplongitude") || headersList.get("CF-IPLongitude")
    const city = headersList.get("cf-ipcity") || headersList.get("CF-IPCity")
    const region = headersList.get("cf-ipregion") || headersList.get("CF-IPRegion")

    // Check if we're in the US
    if (country && country !== "US") {
      // Not in US, return null to use random zip code
      return NextResponse.json({ zipCode: null })
    }

    // If we have coordinates, use reverse geocoding to get ZIP code
    if (latitude && longitude) {
      try {
        // Use OpenStreetMap Nominatim for reverse geocoding (free, no API key required)
        const lat = parseFloat(latitude)
        const lon = parseFloat(longitude)
        
        if (isNaN(lat) || isNaN(lon)) {
          return NextResponse.json({ zipCode: null })
        }

        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`,
          {
            headers: {
              "User-Agent": "404lovefound/1.0", // Required by Nominatim
            },
          }
        )

        if (response.ok) {
          const data = await response.json()
          const postalCode = data?.address?.postcode

          // Validate it's a US ZIP code (5 digits)
          if (postalCode && /^\d{5}$/.test(postalCode)) {
            return NextResponse.json({ zipCode: postalCode })
          }
        }
      } catch (geocodeError) {
        console.error("Error in reverse geocoding:", geocodeError)
        // Fall through to return null
      }
    }

    // Log available headers for debugging
    console.log("Cloudflare headers:", {
      country,
      city,
      region,
      latitude,
      longitude,
    })

    // Return null if we can't determine a valid US ZIP code
    return NextResponse.json({ zipCode: null })
  } catch (error) {
    console.error("Error reading Cloudflare headers:", error)
    return NextResponse.json({ zipCode: null })
  }
}
