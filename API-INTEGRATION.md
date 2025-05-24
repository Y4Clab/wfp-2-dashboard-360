# Maps API Integration

This document explains how the Google Maps component integrates with the backend API.

## Environment Configuration

To connect the Maps component with your backend API, set the following environment variable:

```
VITE_APP_API_URL=http://localhost:3000/api
```

You can add this to your `.env` file at the root of the project.

## Route Data Format

When a route is calculated, the following data is sent to the backend API:

```typescript
interface RouteData {
  origin: string; // Origin location (address or place name)
  destination: string; // Final destination location (address or place name)
  waypoints: string[]; // Array of intermediate stops (addresses or place names)
  distance: string; // Total distance of the route (e.g., "5.2 km")
  duration: string; // Estimated travel time (e.g., "15 mins")
  polyline: string; // Encoded polyline of the route path
  path: Location[]; // Array of coordinates along the route
}

interface Location {
  lat: number;
  lng: number;
}
```

## API Endpoint

The route data is sent to:

```
${VITE_APP_API_URL}/routes
```

Using a POST request with the route data in the request body.

## Backend Implementation

Your backend API should implement a POST endpoint at `/routes` that accepts the route data format described above.

Example Express.js implementation:

```javascript
app.post("/api/routes", (req, res) => {
  const routeData = req.body;

  // Save route data to database or process it as needed
  console.log("Received route data:", routeData);

  // Example: Access waypoints for multiple destinations
  const numStops = routeData.waypoints.length;
  console.log(`Route with ${numStops} intermediate stops`);

  // Return success response
  res.status(200).json({ success: true, message: "Route data received" });
});
```

## Multiple Destinations Support

The Maps component now supports multiple destinations through waypoints. A route can be calculated from:

- Origin (starting point)
- Through multiple waypoints (intermediate stops)
- To the final destination

This allows for planning complex routes with multiple stops, which is especially useful for:

- Delivery planning
- Multi-stop field visits
- Logistics optimization

## Error Handling

The Maps component includes error handling for API communication. If the API URL is not configured or the request fails, errors will be logged to the console but will not disrupt the user experience with the maps functionality.
