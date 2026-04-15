# Weather Forecast

A simple React + Vite app that shows current weather conditions for your location and lets you search any city in the world.

## Setup

1. Run `npm install` to install the dependencies
2. Run `npm run dev` to launch the app at `http://localhost:5173/`

## Architecture

The data layer is split into two files:

- **`api.ts`** — contains all the functions that make HTTP calls to the Open-Meteo and geocoding APIs. This mimics the role a backend service would play: each function maps to a specific endpoint and returns typed data.
- **`hooks.ts`** — wraps those API functions into React Query hooks (`useCurrentWeather`, `useHourlyForecast`, etc.). Pages and components call these hooks directly instead of calling `api.ts` themselves.

**React Query** handles caching, loading, and error states for all API calls. **React Router** handles navigation between pages. UI components (dialogs, sidebar, calendar, etc.) are built with **shadcn/ui**.

## Pages

### Forecast (`/`)

Asks the user for browser location permissions and uses their coordinates to fetch current weather. Below the hero section there is a hardcoded list of cities displayed in a table (desktop) or card list (mobile).

### Search modal

A search bar is available in the navbar across the entire app by design — it is mounted in the layout, not inside any page. Searching a city opens a modal with three tabs:

- **Hourly** — next 12 hours of temperature and precipitation
- **Weekly** — 7-day forecast with daily highs and lows
- **Calendar** — pick any day within the next week to see its hourly breakdown

## Design decisions

The brief suggested using raw coordinates to identify locations, but this app uses **reverse geocoding** instead — converting coordinates into a human-readable city name via the **BigDataCloud reverse geocoding API** (no API key required). This is more intuitive for the user and avoids showing raw latitude/longitude values in the UI.

The Open-Meteo API returns numeric **WMO weather codes** for conditions. These are mapped in `src/lib/weather.ts` to human-readable labels and emojis (e.g. code `63` → "Rain" + 🌧) so the UI shows something meaningful instead of a raw number.

## Known issues

The `precipitation` field returned by the current weather endpoint is consistently `0.00` regardless of actual conditions.
