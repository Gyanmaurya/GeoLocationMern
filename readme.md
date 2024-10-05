# for get distance by cordinates to address 
<!-- {
 "userLocation":{"latitude": 28.508160,"longitude": 77.234176},
    "targetLocation":{"latitude": 28.51397307816621, "longitude": 77.22834490533823
    }
} -->
# for get distance by address to cordinates
<!-- {
 "currentAddress":"delhi",
 "targetAddress":"noida"
} -->
# for the create Shop
<!-- 
{
 "name":"Sector 126, Noida, 201313, Uttar Pradesh, India",
  "latitude":"28.539275891929872",
  "longitude":"77.34515401199039"
} -->
# for the nearBy
<!-- {
 
  "latitude":"28.539275891929872",
  "longitude":"77.34515401199039"
} -->



# Geolocation base address colculation of data useing Longitude and Latitude
# We can use tools 


# OpenStreetMap (OSM) - Nominatim API (Free) 

OpenStreetMap is completely free and open-source. You can use the Nominatim API for geocoding (converting addresses to coordinates or vice versa).
No API key required.
Free for all time (with request limits).
Ideal for testing.
Not as accurate as Google Maps for some use cases.
Limited to non-commercial projects.

# PositionStack (Free Tier)
PositionStack is a geolocation API that provides 25,000 free requests per month. It's great for testing without any initial costs.
Free for a reasonable amount of testing.
Provides forward and reverse geocoding.
You’ll need an API key.
You can register at positionstack.com to get your free API key.

# Google Maps API - Free Tier

Google Maps offers a $200 monthly free credit, which is generally enough for low-volume testing and development purposes. It includes the Distance Matrix API, which calculates distances between locations.
High accuracy.
Includes many features like distance matrix, directions, and real-time location tracking.
After exceeding the $200 credit, you’ll need to pay.
Requires an API key and billing setup (but no charges unless you exceed free credits).

# Local/Manual Testing (No External API)

If you want to avoid using external services altogether for testing purposes, you can mock location data. This approach doesn’t involve actual geolocation data but simulates it in a controlled environment.

Here’s how you could manually define static coordinates for two locations and calculate the distance using the geolib library:

