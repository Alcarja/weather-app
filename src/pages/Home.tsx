import { CloudSun, Earth, Zap } from 'lucide-react'

const features = [
  {
    icon: Earth,
    title: 'Worldwide Coverage',
    description:
      'Access real-time weather data for any location on Earth. From major cities to remote regions, WeatherCast pulls accurate forecasts from the Open-Meteo API — no API key required.',
  },
  {
    icon: CloudSun,
    title: 'Detailed Forecasts',
    description:
      'Get hourly and daily breakdowns of temperature, precipitation, wind speed, humidity, and more. Everything you need to plan your day, week, or trip.',
  },
  {
    icon: Zap,
    title: 'Fast & Free',
    description:
      'Powered by Open-Meteo\'s open-source weather models, WeatherCast delivers high-accuracy forecasts instantly — completely free, with no account needed.',
  },
]

function Home() {
  return (
    <div className="min-h-full">

      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl bg-linear-to-br from-sky-500 to-blue-700 px-8 py-20 text-white text-center">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] bg-size-[32px_32px]" />
        <div className="relative">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur-sm mb-6">
            <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Powered by Open-Meteo
          </span>
          <h1 className="text-5xl font-bold tracking-tight mb-4">
            Weather, anywhere<br />in the world
          </h1>
          <p className="text-lg text-white/70 max-w-xl mx-auto">
            Real-time forecasts for every corner of the planet. Free, fast, and beautifully simple.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="mt-12">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-6">
          What WeatherCast offers
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {features.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="rounded-xl border border-border bg-card p-6 flex flex-col gap-4"
            >
              <div className="size-10 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center">
                <Icon className="size-5 text-sky-500" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Data source callout */}
      <section className="mt-6 rounded-xl border border-border bg-muted/40 px-6 py-5 flex items-start gap-4">
        <div className="size-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
          <span className="text-base">🌐</span>
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">Open-Meteo Weather API</p>
          <p className="text-sm text-muted-foreground mt-0.5">
            WeatherCast is built on top of Open-Meteo, an open-source weather API with high-resolution forecasts from multiple national weather services including NOAA, ECMWF, and DWD.
          </p>
        </div>
      </section>

      {/* Weather metrics */}
      <section className="mt-12">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-6">
          What we track
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {[
            { emoji: '🌡️', label: 'Temperature' },
            { emoji: '💨', label: 'Wind Speed' },
            { emoji: '💧', label: 'Precipitation' },
            { emoji: '👁️', label: 'Visibility' },
            { emoji: '🧭', label: 'Pressure' },
            { emoji: '🌅', label: 'Sunrise & Sunset' },
          ].map(({ emoji, label }) => (
            <div
              key={label}
              className="rounded-xl border border-border bg-card px-4 py-5 flex flex-col items-center gap-2 text-center"
            >
              <span className="text-2xl">{emoji}</span>
              <span className="text-xs font-medium text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mt-6 rounded-2xl bg-linear-to-br from-slate-900 to-slate-800 px-8 py-12 text-center flex flex-col items-center gap-4">
        <h2 className="text-2xl font-bold text-white tracking-tight">Ready to check the forecast?</h2>
        <p className="text-sm text-slate-400 max-w-md">
          Search any city, region, or set of coordinates and get an instant, detailed weather report — powered by open data.
        </p>
        <button className="mt-2 inline-flex items-center gap-2 rounded-full bg-sky-500 hover:bg-sky-400 transition-colors px-6 py-2.5 text-sm font-semibold text-white">
          <Zap className="size-4" />
          Get the forecast
        </button>
      </section>

    </div>
  )
}

export default Home
