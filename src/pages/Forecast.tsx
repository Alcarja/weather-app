import { MapPin, Wind, Droplets, Thermometer, Eye } from "lucide-react";
import {
  useGeolocation,
  useCurrentWeather,
  useHourlyForecast,
  useReverseGeocode,
} from "@/adapters/hooks";
import { getWeatherInfo } from "@/lib/weather";
import type { Coordinates } from "@/adapters/api";

// --- Cities with real coordinates ---

const otherLocations: { city: string; country: string; coords: Coordinates }[] = [
  { city: "London",    country: "GB", coords: { latitude: 51.5074,  longitude: -0.1278  } },
  { city: "Tokyo",     country: "JP", coords: { latitude: 35.6762,  longitude: 139.6503 } },
  { city: "Sydney",    country: "AU", coords: { latitude: -33.8688, longitude: 151.2093 } },
  { city: "Paris",     country: "FR", coords: { latitude: 48.8566,  longitude: 2.3522   } },
  { city: "Dubai",     country: "AE", coords: { latitude: 25.2048,  longitude: 55.2708  } },
  { city: "São Paulo", country: "BR", coords: { latitude: -23.5505, longitude: -46.6333 } },
];


// --- Sub-components ---

function StatItem({
  icon, label, value,
}: {
  icon: React.ReactNode; label: string; value: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-xl bg-white/10 px-3 py-2.5 sm:flex-row sm:gap-1.5 sm:rounded-lg sm:px-2.5 sm:py-2">
      <span className="text-white/60">{icon}</span>
      <span className="text-[10px] text-white/50 sm:text-xs sm:text-white/60">{label}</span>
      <span className="text-xs font-bold text-white sm:font-semibold">{value}</span>
    </div>
  );
}

function HeroSkeleton() {
  return (
    <section className="rounded-2xl bg-linear-to-br from-sky-500 to-blue-700 p-4 sm:p-6 text-white">
      <div className="flex flex-col gap-4 animate-pulse">
        <div className="h-4 w-36 rounded-full bg-white/20" />
        <div className="h-16 w-24 rounded-xl bg-white/20" />
        <div className="grid grid-cols-5 gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-14 rounded-xl bg-white/20" />
          ))}
        </div>
      </div>
    </section>
  );
}

function HeroError({ message }: { message: string }) {
  return (
    <section className="rounded-2xl border border-border bg-muted/40 p-6 text-center text-sm text-muted-foreground">
      <MapPin className="size-5 mx-auto mb-2 opacity-40" />
      {message}
    </section>
  );
}

// Each row fetches its own data so hooks aren't called in a loop
function LocationRow({ city, country, coords }: { city: string; country: string; coords: Coordinates }) {
  const { data: weather, isLoading } = useCurrentWeather(coords);
  const current = weather?.current;
  const weatherInfo = current ? getWeatherInfo(current.weather_code) : null;
  const high = weather ? Math.round(weather.daily.temperature_2m_max[0]) : null;
  const low  = weather ? Math.round(weather.daily.temperature_2m_min[0]) : null;
  const precipitation = current ? current.precipitation : null;

  if (isLoading) {
    return (
      <tr className="border-b border-border last:border-0 animate-pulse">
        <td className="px-4 py-3"><div className="h-3 w-24 rounded bg-muted" /></td>
        <td className="px-4 py-3"><div className="h-3 w-28 rounded bg-muted" /></td>
        <td className="px-4 py-3"><div className="h-3 w-8 rounded bg-muted ml-auto" /></td>
        <td className="px-4 py-3"><div className="h-3 w-8 rounded bg-muted ml-auto" /></td>
        <td className="px-4 py-3"><div className="h-3 w-8 rounded bg-muted ml-auto" /></td>
      </tr>
    );
  }

  return (
    <tr className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
      <td className="px-4 py-3 font-medium">
        {city}
        <span className="ml-1.5 text-xs text-muted-foreground">{country}</span>
      </td>
      <td className="px-4 py-3 text-muted-foreground">
        <span className="mr-1.5">{weatherInfo?.emoji ?? "—"}</span>
        {weatherInfo?.label ?? "—"}
      </td>
      <td className="px-4 py-3 text-right font-semibold">{high !== null ? `${high}°` : "—"}</td>
      <td className="px-4 py-3 text-right text-muted-foreground">{low !== null ? `${low}°` : "—"}</td>
      <td className="px-4 py-3 text-right">
        <span className={precipitation !== null && precipitation >= 50 ? "text-sky-500 font-medium" : "text-muted-foreground"}>
          {precipitation !== null ? `${precipitation}mm` : "—"}
        </span>
      </td>
    </tr>
  );
}

function LocationCard({ city, country, coords }: { city: string; country: string; coords: Coordinates }) {
  const { data: weather, isLoading } = useCurrentWeather(coords);
  const current = weather?.current;
  const weatherInfo = current ? getWeatherInfo(current.weather_code) : null;
  const high = weather ? Math.round(weather.daily.temperature_2m_max[0]) : null;
  const low  = weather ? Math.round(weather.daily.temperature_2m_min[0]) : null;

  if (isLoading) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 animate-pulse">
        <div className="size-8 rounded-full bg-muted shrink-0" />
        <div className="flex-1 flex flex-col gap-1.5">
          <div className="h-3 w-24 rounded bg-muted" />
          <div className="h-2.5 w-16 rounded bg-muted" />
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <div className="h-3 w-8 rounded bg-muted" />
          <div className="h-2.5 w-6 rounded bg-muted" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3">
      <span className="text-2xl shrink-0">{weatherInfo?.emoji ?? "—"}</span>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm">
          {city} <span className="text-xs text-muted-foreground font-normal">{country}</span>
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">{weatherInfo?.label ?? "—"}</p>
      </div>
      <div className="text-right shrink-0">
        <p className="text-sm font-semibold">{high !== null ? `${high}°` : "—"}</p>
        <p className="text-xs text-muted-foreground">{low !== null ? `${low}°` : "—"}</p>
      </div>
    </div>
  );
}

// --- Page ---

function Forecast() {
  const { coords, loading: geoLoading, error: geoError } = useGeolocation();
  const { data: weather, isLoading: weatherLoading, error: weatherError } = useCurrentWeather(coords);
  const { data: hourlyData } = useHourlyForecast(coords);
  const { data: location } = useReverseGeocode(coords);

  const isLoading = geoLoading || weatherLoading;
  const error = geoError ?? (weatherError ? "Failed to fetch weather data." : null);

  const current = weather?.current;
  const weatherInfo = current ? getWeatherInfo(current.weather_code) : null;
  const city = location?.city || location?.locality || "—";
  const country = location?.countryCode ?? "—";

  const now = new Date();
  const hourlyForecast = (() => {
    if (!hourlyData) return [];
    const times = hourlyData.hourly.time;
    const startIdx = times.findIndex((t) => new Date(t) >= now);
    const idx = startIdx === -1 ? 0 : startIdx;
    return times.slice(idx, idx + 12).map((t, i) => ({
      time: i === 0 ? "Now" : new Date(t).toLocaleTimeString("en-US", { hour: "numeric", hour12: true }),
      emoji: getWeatherInfo(hourlyData.hourly.weather_code[idx + i]).emoji,
      temp: Math.round(hourlyData.hourly.temperature_2m[idx + i]),
    }));
  })();

  return (
    <div className="flex flex-col gap-4 sm:gap-6">

      {/* Current location hero */}
      {isLoading && <HeroSkeleton />}
      {!isLoading && error && <HeroError message={error} />}
      {!isLoading && !error && current && weatherInfo && (
        <section className="rounded-2xl bg-linear-to-br from-sky-500 to-blue-700 p-4 sm:p-6 text-white">
          <div className="relative flex flex-col gap-3 sm:gap-4">
            <div className="flex items-center gap-1.5 text-white/70 text-sm">
              <MapPin className="size-3.5 shrink-0" />
              <span className="truncate">{city}, {country}</span>
              <span className="ml-auto shrink-0 text-white/50 text-xs">
                H:{Math.round(weather.daily.temperature_2m_max[0])}° L:{Math.round(weather.daily.temperature_2m_min[0])}°
              </span>
            </div>
            <div className="flex items-end gap-3">
              <span className="text-7xl sm:text-8xl font-thin leading-none">
                {Math.round(current.temperature_2m)}°
              </span>
              <div className="mb-1">
                <div className="text-3xl sm:text-4xl">{weatherInfo.emoji}</div>
                <p className="text-white/80 text-sm mt-1">{weatherInfo.label}</p>
              </div>
            </div>
            <div className="grid grid-cols-5 gap-2 sm:flex sm:flex-wrap">
              <StatItem icon={<Thermometer className="size-3" />} label="Feels like"  value={`${Math.round(current.apparent_temperature)}°`} />
              <StatItem icon={<Droplets className="size-3" />}    label="Humidity"    value={`${current.relative_humidity_2m}%`} />
              <StatItem icon={<Wind className="size-3" />}        label="Wind"        value={`${Math.round(current.wind_speed_10m)}km/h`} />
              <StatItem icon={<Eye className="size-3" />}         label="Visibility"  value={`${(current.visibility / 1000).toFixed(1)}km`} />
              <StatItem icon={<span className="text-[10px] font-bold">UV</span>} label="Index" value={`${current.uv_index}`} />
            </div>
          </div>
        </section>
      )}

      {/* Hourly forecast */}
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Hourly</h2>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {!hourlyData
            ? Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card px-3 sm:px-4 py-3 flex-1 min-w-12 sm:min-w-14 animate-pulse">
                  <div className="h-2.5 w-8 rounded bg-muted" />
                  <div className="h-5 w-5 rounded-full bg-muted" />
                  <div className="h-3 w-6 rounded bg-muted" />
                </div>
              ))
            : hourlyForecast.map(({ time, emoji, temp }) => (
                <div key={time} className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card px-3 sm:px-4 py-3 flex-1 min-w-12 sm:min-w-14">
                  <span className="text-[11px] sm:text-xs text-muted-foreground font-medium whitespace-nowrap">{time}</span>
                  <span className="text-lg sm:text-xl">{emoji}</span>
                  <span className="text-sm font-semibold">{temp}°</span>
                </div>
              ))
          }
        </div>
      </section>

      {/* Other locations */}
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Other Locations</h2>

        {/* Mobile: cards */}
        <div className="flex flex-col gap-2 sm:hidden">
          {otherLocations.map(({ city, country, coords }) => (
            <LocationCard key={city} city={city} country={country} coords={coords} />
          ))}
        </div>

        {/* Desktop: table */}
        <div className="hidden sm:block rounded-xl border border-border bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Location</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Condition</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground">High</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground">Low</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground">Precip.</th>
              </tr>
            </thead>
            <tbody>
              {otherLocations.map(({ city, country, coords }) => (
                <LocationRow key={city} city={city} country={country} coords={coords} />
              ))}
            </tbody>
          </table>
        </div>
      </section>

    </div>
  );
}

export default Forecast;
