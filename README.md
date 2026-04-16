# Weather Forecast

A simple React + Vite app that shows current weather conditions for your location and lets you search any city in the world.

## Setup

1. Run `npm install` to install the dependencies
2. Run `npm run dev` to launch the app at `http://localhost:5173/`

## Architecture

The data layer is split into two files:

- **`api.ts`** — contains all the functions that make HTTP calls to the Open-Meteo and geocoding APIs. This mimics the role a backend service would play: each function maps to a specific endpoint and returns typed data.
- **`hooks.ts`** — wraps those API functions into React Query hooks (`useCurrentWeather`, `useHourlyForecast`, etc.). Pages and components call these hooks directly instead of calling `api.ts` themselves.
- **`types.ts`** — shared TypeScript interfaces for all API request and response shapes.

**React Query** handles caching, loading, and error states for all API calls. **React Router** handles navigation between pages. UI components (dialogs, sidebar, calendar, etc.) are built with **shadcn/ui**.

## API calls

The app makes three distinct API calls, each serving a different purpose:

### 1. Geolocation → Reverse Geocoding (BigDataCloud)

When the app loads, the browser asks the user for location permission. If granted, it receives raw coordinates (`latitude`, `longitude`). Those coordinates are then passed to the **BigDataCloud reverse geocoding API**, which converts them into a human-readable city and country name (e.g. `{ city: "Singapore", countryName: "Singapore" }`). This name is displayed in the UI instead of raw numbers. If the user denies permission, the app falls back to Singapore.

### 2. Current Weather (Open-Meteo `/forecast` — current variables)

Once coordinates are available, the app fetches current conditions from the **Open-Meteo forecast endpoint**, requesting fields like temperature, apparent temperature, humidity, wind speed, UV index, and weather code. It also fetches today's high/low from the `daily` block in the same request. This data powers the hero section on the Forecast page. Results are cached and refetched every 5 minutes.

### 3. Hourly & Daily Forecast (Open-Meteo `/forecast` — hourly/daily variables)

When a user searches for a city and opens the modal, two more calls are made to the same Open-Meteo endpoint — one requesting `hourly` variables (temperature, weather code, precipitation probability) and one requesting `daily` variables (highs, lows, weather code, max precipitation probability) for a 7-day window. These power the Hourly, Weekly, and Calendar tabs in the search modal. Hourly data is cached for 15 minutes; daily data for 30 minutes.

## User flow

1. User opens the app → browser requests location permission.
2. If granted, coordinates are used to reverse-geocode a city name and fetch current weather. If denied, Singapore is used as the default.
3. The Forecast page displays current conditions (temperature, wind, humidity, etc.) along with a table of hardcoded cities.
4. The user types a city name into the search bar in the navbar. Results come from the **Open-Meteo Geocoding API** (`/search`).
5. Selecting a city opens a modal. Hourly and daily forecasts are fetched for that city's coordinates.
6. The user can switch between the Hourly, Weekly, and Calendar tabs to explore the forecast.

## Pages

### Forecast (`/`)

Asks the user for browser location permissions and uses their coordinates to fetch current weather. Below the hero section there is a hardcoded list of cities displayed in a table (desktop) or card list (mobile).

### Search modal

A search bar is available in the navbar across the entire app by design — it is mounted in the layout, not inside any page. Searching a city opens a modal with three tabs:

- **Hourly** — next 12 hours of temperature and precipitation
- **Weekly** — 7-day forecast with daily highs and lows
- **Calendar** — pick any day within the next week to see its hourly breakdown

## Design decisions

The brief suggested using raw coordinates to identify locations, but this app uses **reverse geocoding** instead. It uses open-meteo to convert coordinates into a human-readable city names via the **BigDataCloud reverse geocoding API**. This is more intuitive for the user and avoids showing raw latitude/longitude values in the UI.

The Open-Meteo API returns numeric **WMO weather codes** for conditions. These are mapped in `src/lib/weather.ts` to human-readable labels and emojis (e.g. code `63` → "Rain" + 🌧) so the UI shows something meaningful instead of a raw number.

## Known issues

The `precipitation` field returned by the current weather endpoint is consistently `0.00` regardless of actual conditions.
