import { useState } from "react";
import {
  MapPin,
  Wind,
  Droplets,
  Thermometer,
  Eye,
  CalendarDays,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import {
  useCurrentWeather,
  useHourlyForecast,
  useDailyForecast,
} from "@/adapters/hooks";
import { getWeatherInfo } from "@/lib/weather";
import type { GeocodingResult } from "@/adapters/api";

interface Props {
  city: GeocodingResult | null;
  onClose: () => void;
}

// Shared card used by all three tabs
function WeatherCard({
  top,
  emoji,
  middle,
  bottom,
  wrapTop,
}: {
  top: string;
  emoji: string;
  middle: string;
  bottom?: string;
  wrapTop?: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-3 flex-1 min-w-14 w-full">
      <span
        className={`text-[11px] text-muted-foreground font-medium text-center leading-tight ${wrapTop ? "h-7 flex items-center justify-center" : "whitespace-nowrap"}`}
      >
        {top}
      </span>
      <span className="text-xl">{emoji}</span>
      <span className="text-sm font-semibold">{middle}</span>
      {bottom !== undefined && (
        <span className="text-[10px] text-muted-foreground">{bottom}</span>
      )}
    </div>
  );
}

function StatItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-xl bg-white/10 px-2 py-2.5 min-w-0">
      <span className="text-white/60">{icon}</span>
      <span className="text-[10px] text-white/50 text-center leading-tight">
        {label}
      </span>
      <span className="text-xs font-bold text-white">{value}</span>
    </div>
  );
}

type Tab = "hourly" | "weekly" | "calendar";

const today = new Date();
today.setHours(0, 0, 0, 0);

//Get the date a week from today
const maxDate = new Date(today);
maxDate.setDate(today.getDate() + 6);

//Format date
function toLocalDateStr(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function CityWeatherModal({ city, onClose }: Props) {
  const [tab, setTab] = useState<Tab>("hourly");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(today));

  const coords = city
    ? { latitude: city.latitude, longitude: city.longitude }
    : null;

  //Hooks
  const { data: weather, isLoading: weatherLoading } =
    useCurrentWeather(coords);
  const { data: hourly, isLoading: hourlyLoading } = useHourlyForecast(coords);
  const { data: daily, isLoading: dailyLoading } = useDailyForecast(coords);

  const isLoading = weatherLoading || hourlyLoading || dailyLoading;
  const current = weather?.current;

  const todayStr = toLocalDateStr(today);
  const selectedDateStr = toLocalDateStr(selectedDate);
  const isToday = selectedDateStr === todayStr;

  const getDailySummary = (dateStr: string) => {
    if (!daily) return null;

    //Find index scans the time array and resturn the position of the matching date (open meteo return data as parallel arrays, not objects)
    const dayIndex = daily.daily.time.findIndex((date) => date === dateStr);
    if (dayIndex === -1) return null;

    //Maps over different codes to return legible labels and emojis
    const weatherInfo = getWeatherInfo(daily.daily.weather_code[dayIndex]);

    return {
      emoji: weatherInfo.emoji,
      condition: weatherInfo.label,
      high: Math.round(daily.daily.temperature_2m_max[dayIndex]),
      low: Math.round(daily.daily.temperature_2m_min[dayIndex]),
      precipitation: daily.daily.precipitation_probability_max[dayIndex],
    };
  };

  const todaySummary = getDailySummary(todayStr);
  const selectedSummary = getDailySummary(selectedDateStr);

  const heroData = (() => {
    if (!current || !weather) return null;
    if (tab === "calendar" && !isToday && selectedSummary) {
      return {
        mainTemp: selectedSummary.high,
        emoji: selectedSummary.emoji,
        condition: selectedSummary.condition,
        high: selectedSummary.high,
        low: selectedSummary.low,
        dateLabel: selectedDate.toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
        }),
        stats: [
          {
            icon: <Thermometer className="size-3" />,
            label: "High",
            value: `${selectedSummary.high}°`,
          },
          {
            icon: <Thermometer className="size-3" />,
            label: "Low",
            value: `${selectedSummary.low}°`,
          },
          {
            icon: <Droplets className="size-3" />,
            label: "Precip.",
            value: `${selectedSummary.precipitation}%`,
          },
          { icon: <Wind className="size-3" />, label: "Wind", value: "—" },
          { icon: <Eye className="size-3" />, label: "Visibility", value: "—" },
        ],
      };
    }

    //Gets the label and the emoji
    const info = getWeatherInfo(current.weather_code);

    return {
      mainTemp: Math.round(current.temperature_2m),
      emoji: info.emoji,
      condition: info.label,
      high:
        todaySummary?.high ?? Math.round(weather.daily.temperature_2m_max[0]),
      low: todaySummary?.low ?? Math.round(weather.daily.temperature_2m_min[0]),
      dateLabel: null,
      stats: [
        {
          icon: <Thermometer className="size-3" />,
          label: "Feels like",
          value: `${Math.round(current.apparent_temperature)}°`,
        },
        {
          icon: <Droplets className="size-3" />,
          label: "Humidity",
          value: `${current.relative_humidity_2m}%`,
        },
        {
          icon: <Wind className="size-3" />,
          label: "Wind",
          value: `${Math.round(current.wind_speed_10m)}km/h`,
        },
        {
          icon: <Eye className="size-3" />,
          label: "Visibility",
          value: `${(current.visibility / 1000).toFixed(1)}km`,
        },
        {
          icon: <span className="text-[10px] font-bold">UV</span>,
          label: "Index",
          value: `${current.uv_index}`,
        },
      ],
    };
  })();

  const now = new Date();

  // Hourly tab — next 12h from now
  const hourlySlice = (() => {
    if (!hourly) return [];
    const times = hourly.hourly.time;
    const startIdx = times.findIndex((t) => new Date(t) >= now);
    const idx = startIdx === -1 ? 0 : startIdx;
    return times.slice(idx, idx + 12).map((t, i) => ({
      top:
        i === 0
          ? "Now"
          : new Date(t).toLocaleTimeString("en-US", {
              hour: "numeric",
              hour12: true,
            }),
      emoji: getWeatherInfo(hourly.hourly.weather_code[idx + i]).emoji,
      middle: `${Math.round(hourly.hourly.temperature_2m[idx + i])}°`,
      bottom: `${hourly.hourly.precipitation_probability[idx + i]}%`,
    }));
  })();

  // Weekly tab — 7 days
  const dailySlice = (() => {
    if (!daily) return [];
    return daily.daily.time.map((t, i) => ({
      top:
        i === 0
          ? "Today"
          : new Date(t).toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
            }),
      emoji: getWeatherInfo(daily.daily.weather_code[i]).emoji,
      middle: `${Math.round(daily.daily.temperature_2m_max[i])}°`,
      bottom: `${Math.round(daily.daily.temperature_2m_min[i])}°`,
    }));
  })();

  // Calendar tab — hourly for selected day
  const calendarDaySlice = (() => {
    if (!hourly) return [];

    const { time, weather_code, temperature_2m, precipitation_probability } = hourly.hourly;

    return time
      .map((timestamp, index) => ({ timestamp, index }))
      .filter(({ timestamp }) => timestamp.startsWith(selectedDateStr))
      .map(({ timestamp, index }) => ({
        top: new Date(timestamp).toLocaleTimeString("en-US", {
          hour: "numeric",
          hour12: true,
        }),
        emoji: getWeatherInfo(weather_code[index]).emoji,
        middle: `${Math.round(temperature_2m[index])}°`,
        bottom: `${precipitation_probability[index]}%`,
      }));
  })();

  const skeletonCards = Array.from({ length: 7 }).map((_, i) => (
    <div
      key={i}
      className="flex flex-col items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-3 flex-1 min-w-14 animate-pulse"
    >
      <div className="h-2.5 w-8 rounded bg-muted" />
      <div className="h-6 w-6 rounded-full bg-muted" />
      <div className="h-3 w-6 rounded bg-muted" />
      <div className="h-2 w-4 rounded bg-muted" />
    </div>
  ));

  return (
    <Dialog open={city !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[95vw]! md:w-[50vw]! min-w-0 p-0 overflow-hidden flex flex-col max-h-[90vh]">
        <DialogHeader className="sr-only">
          <DialogTitle>{city?.name} Weather</DialogTitle>
        </DialogHeader>

        {/* Hero — fixed, never scrolls */}
        <div className="bg-linear-to-br from-sky-500 to-blue-700 p-4 sm:p-5 text-white shrink-0">
          {isLoading ? (
            <div className="flex flex-col gap-4 animate-pulse">
              <div className="h-4 w-36 rounded-full bg-white/20" />
              <div className="h-16 w-24 rounded-xl bg-white/20" />
              <div className="grid grid-cols-5 gap-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-14 rounded-xl bg-white/20" />
                ))}
              </div>
            </div>
          ) : heroData && city ? (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-1.5 text-white/70 text-sm">
                <MapPin className="size-3.5 shrink-0" />
                <span className="truncate">
                  {city.name}
                  {city.admin1 ? `, ${city.admin1}` : ""} · {city.country}
                </span>
                <span className="ml-auto shrink-0 text-white/50 text-xs">
                  H:{heroData.high}° L:{heroData.low}°
                </span>
              </div>
              {heroData.dateLabel && (
                <div className="inline-flex items-center gap-1.5 self-start rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-xs text-white/80">
                  <CalendarDays className="size-3" />
                  {heroData.dateLabel}
                </div>
              )}
              <div className="flex items-end gap-3">
                <span className="text-6xl sm:text-7xl font-thin leading-none">
                  {heroData.mainTemp}°
                </span>
                <div className="mb-1">
                  <div className="text-3xl">{heroData.emoji}</div>
                  <p className="text-white/80 text-sm mt-1">
                    {heroData.condition}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
                {heroData.stats.map(({ icon, label, value }) => (
                  <StatItem
                    key={label}
                    icon={icon}
                    label={label}
                    value={value}
                  />
                ))}
              </div>
            </div>
          ) : null}
        </div>

        {/* Tab bar — fixed */}
        <div className="flex border-b border-border shrink-0">
          {(["hourly", "weekly", "calendar"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-3 text-xs font-semibold uppercase tracking-widest transition-colors border-b-2 -mb-px ${
                tab === t
                  ? "border-sky-500 text-sky-500"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Scrollable content area */}
        <div className="overflow-y-auto flex-1 p-4">
          {isLoading ? (
            <div className="flex gap-2">{skeletonCards}</div>
          ) : tab === "hourly" ? (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {hourlySlice.map((card) => (
                <WeatherCard key={card.top} {...card} />
              ))}
            </div>
          ) : tab === "weekly" ? (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {dailySlice.map((card) => (
                <div key={card.top} className="flex-1 min-w-20 sm:min-w-24">
                  <WeatherCard {...card} wrapTop />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(d) => d && setSelectedDate(d)}
                disabled={{ before: today, after: maxDate }}
                className="rounded-xl border border-border self-center"
              />
              <div className="flex gap-2 overflow-x-auto pb-1">
                {calendarDaySlice.map((card) => (
                  <WeatherCard key={card.top} {...card} />
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
