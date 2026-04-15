import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import {
  getCurrentWeather,
  getHourlyForecast,
  getDailyForecast,
  searchLocation,
  reverseGeocode,
  type Coordinates,
} from "./api";

// ---------------------------------------------------------------------------
// Query keys
// ---------------------------------------------------------------------------

export const weatherKeys = {
  current: (coords: Coordinates) => ["weather", "current", coords] as const,
  hourly: (coords: Coordinates) => ["weather", "hourly", coords] as const,
  daily: (coords: Coordinates) => ["weather", "daily", coords] as const,
  search: (query: string) => ["weather", "search", query] as const,
  reverseGeo: (coords: Coordinates) =>
    ["weather", "reverse-geo", coords] as const,
};

// ---------------------------------------------------------------------------
// Hooks
// ---------------------------------------------------------------------------

/**
 * Current weather conditions for a coordinate.
 * Refetches every 5 minutes.
 */
export function useCurrentWeather(coords: Coordinates | null) {
  return useQuery({
    queryKey: weatherKeys.current(coords!),
    queryFn: () => getCurrentWeather(coords!),
    enabled: coords !== null,
    refetchInterval: 5 * 60 * 1000,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hourly forecast for the next 24 hours.
 * Refetches every 15 minutes.
 */
export function useHourlyForecast(coords: Coordinates | null) {
  return useQuery({
    queryKey: weatherKeys.hourly(coords!),
    queryFn: () => getHourlyForecast(coords!),
    enabled: coords !== null,
    refetchInterval: 15 * 60 * 1000,
    staleTime: 15 * 60 * 1000,
  });
}

/**
 * 7-day daily forecast for a coordinate.
 * Refetches every 30 minutes.
 */
export function useDailyForecast(coords: Coordinates | null) {
  return useQuery({
    queryKey: weatherKeys.daily(coords!),
    queryFn: () => getDailyForecast(coords!),
    enabled: coords !== null,
    refetchInterval: 30 * 60 * 1000,
    staleTime: 30 * 60 * 1000,
  });
}

/**
 * Location search via Open-Meteo Geocoding API.
 * Only fires when query is at least 2 characters.
 */
export function useLocationSearch(query: string) {
  return useQuery({
    queryKey: weatherKeys.search(query),
    queryFn: () => searchLocation(query),
    enabled: query.trim().length >= 2,
    staleTime: 60 * 60 * 1000,
  });
}

/**
 * Converts coordinates into a city/country name.
 */
export function useReverseGeocode(coords: Coordinates | null) {
  return useQuery({
    queryKey: weatherKeys.reverseGeo(coords!),
    queryFn: () => reverseGeocode(coords!),
    enabled: coords !== null,
    staleTime: Infinity, // a coordinate's city name never changes
  });
}

/**
 * Requests the user's current position from the browser Geolocation API.
 * Returns coords once granted, or an error message if denied.
 */
export function useGeolocation() {
  const [coords, setCoords] = useState<Coordinates | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setLoading(false);
      },
      () => {
        setError(
          "Location access denied. Please enable it in your browser settings.",
        );
        setLoading(false);
      },
    );
  }, []);

  return { coords, error, loading };
}
