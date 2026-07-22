import * as React from 'react'
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import { Search } from 'lucide-react'
import 'leaflet/dist/leaflet.css'

const markerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

const DEFAULT_CENTER: [number, number] = [10.7769, 106.7009] // TP.HCM

interface LocationMapPickerProps {
  lat?: number
  lng?: number
  onChange: (lat: number, lng: number, address?: string) => void
  className?: string
}

async function reverseGeocode(lat: number, lng: number): Promise<string | undefined> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
    )
    const result = await res.json()
    return result.display_name as string | undefined
  } catch {
    return undefined
  }
}

function ClickHandler({ onChange }: { onChange: (lat: number, lng: number, address?: string) => void }) {
  useMapEvents({
    async click(e) {
      const { lat, lng } = e.latlng
      onChange(lat, lng, await reverseGeocode(lat, lng))
    },
  })
  return null
}

function FlyTo({ lat, lng }: { lat?: number; lng?: number }) {
  const map = useMap()
  React.useEffect(() => {
    if (lat != null && lng != null) map.flyTo([lat, lng], 16)
  }, [lat, lng, map])
  return null
}

export function LocationMapPicker({ lat, lng, onChange, className }: LocationMapPickerProps) {
  const center: [number, number] = lat != null && lng != null ? [lat, lng] : DEFAULT_CENTER
  const [query, setQuery] = React.useState('')
  const [searching, setSearching] = React.useState(false)

  const handleSearch = async () => {
    if (!query.trim()) return
    setSearching(true)
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(query)}`,
      )
      const results = await res.json()
      if (results[0]) {
        onChange(parseFloat(results[0].lat), parseFloat(results[0].lon), results[0].display_name)
      }
    } finally {
      setSearching(false)
    }
  }

  return (
    <div className={className}>
      <div className="flex gap-2 mb-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                handleSearch()
              }
            }}
            placeholder="Tìm địa chỉ..."
            className="w-full h-10 pl-9 pr-3 rounded-lg bg-white text-black text-sm placeholder:text-gray-400 outline-none border border-border focus:border-brand"
          />
        </div>
        <button
          type="button"
          onClick={handleSearch}
          disabled={searching}
          className="px-3 h-10 rounded-lg bg-surface-elevated border border-border text-sm text-text-secondary hover:bg-border transition-colors cursor-pointer disabled:opacity-50"
        >
          {searching ? '...' : 'Tìm'}
        </button>
      </div>
      <div className="rounded-lg overflow-hidden border border-border" style={{ height: 240 }}>
        <MapContainer center={center} zoom={lat != null ? 16 : 13} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {lat != null && lng != null && <Marker position={[lat, lng]} icon={markerIcon} />}
          <ClickHandler onChange={onChange} />
          <FlyTo lat={lat} lng={lng} />
        </MapContainer>
      </div>
      <p className="text-xs text-text-muted mt-1.5">Tìm địa chỉ hoặc bấm vào bản đồ để chọn vị trí</p>
    </div>
  )
}
