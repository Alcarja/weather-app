import { useState, useRef, useEffect } from 'react'
import { Search, MapPin } from 'lucide-react'
import { useLocationSearch } from '@/adapters/hooks'
import { CityWeatherModal } from './CityWeatherModal'
import type { GeocodingResult } from '@/adapters/api'

export function SearchBar() {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [selectedCity, setSelectedCity] = useState<GeocodingResult | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const { data: results = [], isFetching } = useLocationSearch(query)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function handleSelect(city: GeocodingResult) {
    setSelectedCity(city)
    setQuery('')
    setOpen(false)
  }

  return (
    <>
      <div ref={containerRef} className="relative w-full max-w-sm">
        {/* Input */}
        <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/50 px-3 py-2 focus-within:border-sky-400 focus-within:ring-2 focus-within:ring-sky-400/20 transition-all">
          <Search className="size-3.5 text-muted-foreground shrink-0" />
          <input
            type="text"
            value={query}
            onChange={e => { setQuery(e.target.value); setOpen(true) }}
            onFocus={() => query.length >= 2 && setOpen(true)}
            placeholder="Search city..."
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground min-w-0"
          />
          {isFetching && (
            <div className="size-3.5 shrink-0 rounded-full border-2 border-muted-foreground/30 border-t-sky-500 animate-spin" />
          )}
        </div>

        {/* Dropdown */}
        {open && results.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1.5 z-50 rounded-xl border border-border bg-popover shadow-lg overflow-hidden">
            {results.map(city => (
              <button
                key={city.id}
                onClick={() => handleSelect(city)}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-accent transition-colors"
              >
                <MapPin className="size-3.5 text-muted-foreground shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{city.name}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {[city.admin1, city.country].filter(Boolean).join(', ')}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* No results */}
        {open && query.length >= 2 && !isFetching && results.length === 0 && (
          <div className="absolute top-full left-0 right-0 mt-1.5 z-50 rounded-xl border border-border bg-popover shadow-lg px-3 py-4 text-center text-sm text-muted-foreground">
            No cities found for "{query}"
          </div>
        )}
      </div>

      <CityWeatherModal city={selectedCity} onClose={() => setSelectedCity(null)} />
    </>
  )
}
