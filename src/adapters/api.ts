import type {
  Coordinates,
  CurrentWeatherResponse,
  HourlyForecastResponse,
  DailyForecastResponse,
  GeocodingResult,
  GeocodingResponse,
  ReverseGeocodeResponse,
} from "./types";

export type {
  Coordinates,
  CurrentWeatherResponse,
  HourlyForecastResponse,
  DailyForecastResponse,
  GeocodingResult,
  GeocodingResponse,
  ReverseGeocodeResponse,
};

const BASE_URL = "https://api.open-meteo.com/v1";
const GEO_URL = "https://geocoding-api.open-meteo.com/v1";
const REVERSE_GEO_URL =
  "https://api.bigdatacloud.net/data/reverse-geocode-client";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(
      `Open-Meteo request failed: ${response.status} ${response.statusText}`,
    );
  }
  return response.json() as Promise<T>;
}

function buildUrl(base: string, params: Record<string, string>): string {
  const url = new URL(base);
  Object.entries(params).forEach(([key, value]) =>
    url.searchParams.set(key, value),
  );
  return url.toString();
}

// ---------------------------------------------------------------------------
// API methods
// ---------------------------------------------------------------------------

/*
  Fetches current weather conditions for a given coordinate.
  Includes today's high/low from the daily endpoint.
*/
export async function getCurrentWeather({
  latitude,
  longitude,
}: Coordinates): Promise<CurrentWeatherResponse> {
  const url = buildUrl(`${BASE_URL}/forecast`, {
    latitude: String(latitude),
    longitude: String(longitude),
    current: [
      "temperature_2m",
      "apparent_temperature",
      "relative_humidity_2m",
      "precipitation",
      "weather_code",
      "wind_speed_10m",
      "wind_direction_10m",
      "visibility",
      "uv_index",
      "is_day",
    ].join(","),
    daily: "temperature_2m_max,temperature_2m_min",
    forecast_days: "1",
    timezone: "auto",
  });
  return fetchJson<CurrentWeatherResponse>(url);
}

/*
  Fetches hourly temperature, weather code, and precipitation probability for the next 24 hours.
*/
export async function getHourlyForecast({
  latitude,
  longitude,
}: Coordinates): Promise<HourlyForecastResponse> {
  const url = buildUrl(`${BASE_URL}/forecast`, {
    latitude: String(latitude),
    longitude: String(longitude),
    hourly: "temperature_2m,weather_code,precipitation_probability",
    forecast_days: "7",
    timezone: "auto",
  });
  return fetchJson<HourlyForecastResponse>(url);
}

/*
  Fetches a 7-day daily forecast (highs, lows, weather code, precipitation).
*/
export async function getDailyForecast({
  latitude,
  longitude,
}: Coordinates): Promise<DailyForecastResponse> {
  const url = buildUrl(`${BASE_URL}/forecast`, {
    latitude: String(latitude),
    longitude: String(longitude),
    daily: [
      "weather_code",
      "temperature_2m_max",
      "temperature_2m_min",
      "precipitation_probability_max",
    ].join(","),
    forecast_days: "7",
    timezone: "auto",
  });
  return fetchJson<DailyForecastResponse>(url);
}

/*
  Uses the free BigDataCloud reverse geocoding API to convert coordinates into readable city/country.
*/
export async function reverseGeocode({
  latitude,
  longitude,
}: Coordinates): Promise<ReverseGeocodeResponse> {
  const url = buildUrl(REVERSE_GEO_URL, {
    latitude: String(latitude),
    longitude: String(longitude),
    localityLanguage: "en",
  });
  return fetchJson<ReverseGeocodeResponse>(url);
}

/*
  Searches for locations by name using the Open-Meteo Geocoding API.
  Returns up to 5 results.
*/
export async function searchLocation(
  query: string,
  count = 5,
): Promise<GeocodingResult[]> {
  const url = buildUrl(`${GEO_URL}/search`, {
    name: query,
    count: String(count),
    language: "en",
    format: "json",
  });
  const data = await fetchJson<GeocodingResponse>(url);
  return data.results ?? [];
}
