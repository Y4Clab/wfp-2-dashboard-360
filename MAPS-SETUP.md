# Google Maps Integration Setup

This document provides instructions for setting up the Google Maps integration in the WFP Dashboard application.

## Features Implemented

1. **View User's Location**

   - Uses browser's Geolocation API to access the user's current location
   - Displays this location on the map with a marker
   - Centers the map on the user's coordinates

2. **Route Between Two Destinations**

   - Enables route planning between a start point and an end point
   - Uses Google Maps' Directions API to fetch and display the route
   - Draws the path visually and shows travel directions

3. **Geocoding**

   - Converts addresses into geographic coordinates (latitude and longitude)
   - Supports reverse geocoding (coordinates to addresses)
   - Useful for marking locations from addresses or displaying address info when clicking on the map

4. **Place Search with Autocomplete**
   - Provides a search input field for location or place name
   - Shows autocomplete suggestions using Google Places API
   - Displays selected places on the map with a marker

## Setup Instructions

### 1. Obtain a Google Maps API Key

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to APIs & Services > Dashboard
4. Click "+ ENABLE APIS AND SERVICES" at the top
5. Search for and enable the following APIs:
   - Maps JavaScript API
   - Directions API
   - Places API
   - Geocoding API
6. Go to APIs & Services > Credentials
7. Click "CREATE CREDENTIALS" and select "API key"
8. Copy your new API key

### 2. Configure the API Key in the Application

1. Open the file `src/lib/maps-config.ts`
2. Replace the placeholder API key with your actual API key:
   ```typescript
   export const GOOGLE_MAPS_API_KEY = "YOUR_ACTUAL_API_KEY";
   ```

### 3. API Key Restrictions (Recommended for Production)

For production use, it's recommended to restrict your API key:

1. In the Google Cloud Console, go to APIs & Services > Credentials
2. Find your API key and click on it
3. Under "Application restrictions", choose "HTTP referrers"
4. Add your application's domain(s)
5. Under "API restrictions", restrict the key to only the APIs you need:
   - Maps JavaScript API
   - Directions API
   - Places API
   - Geocoding API
6. Click "Save"

## Usage

The Google Maps integration is now available in the Live Tracking page of the application. You can:

- View your current location by clicking "Use My Location"
- Search for places using the search box
- Plan routes by entering a starting point and destination
- View truck locations and routes on the map

## Troubleshooting

If the map doesn't load correctly:

1. Check that your API key is correct
2. Verify that the required APIs are enabled in the Google Cloud Console
3. Check the browser console for any error messages
4. Ensure billing is enabled for your Google Cloud project (required for API usage)
