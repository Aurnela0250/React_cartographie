"use client"

import { useEffect, useRef, useState } from "react"
import { Card } from "@/presentation/components/ui/card"
import { Button } from "@/presentation/components/ui/button"
import { Badge } from "@/presentation/components/ui/badge"
import { Loader2, MapPin, Plus, Minus, Layers } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/presentation/components/ui/dropdown-menu"
import Link from "next/link"

const mockEstablishments = [
  {
    id: "1",
    name: "Université d'Antananarivo",
    type: "Université",
    address: "Ankatso, Antananarivo",
    coordinates: { lat: 48.712, lng: 2.213 },
    programs: 350,
    students: 48000,
  },
  {
    id: "2",
    name: "École Polytechnique",
    type: "Grande École",
    address: "Vontovorona, Anatananarivo",
    coordinates: { lat: 48.7147, lng: 2.2118 },
    programs: 120,
    students: 3000,
  },
  {
    id: "3",
    name: "ESMIA ",
    type: "Université",
    address: "Mahamasina, Antananarivo",
    coordinates: { lat: 48.8515, lng: 2.3408 },
    programs: 400,
    students: 55000,
  },
  {
    id: "4",
    name: "IEP",
    type: "Institut",
    address: "Ampasanimalo",
    coordinates: { lat: 48.8539, lng: 2.3265 },
    programs: 80,
    students: 14000,
  },
  {
    id: "5",
    name: "INSCAE",
    type: "Institue",
    address: "67Ha, Antananarivo",
    coordinates: { lat: 45.7829, lng: 4.879 },
    programs: 90,
    students: 6000,
  },
]

interface MapExplorerProps {
  preview?: boolean
}

export function MapExplorer({ preview = false }: MapExplorerProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState(true)
  const [selectedEstablishment, setSelectedEstablishment] = useState<(typeof mockEstablishments)[0] | null>(null)
  const [zoom, setZoom] = useState(5)

  // Simulate map loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  const handleZoomIn = () => {
    setZoom(Math.min(zoom + 1, 18))
  }

  const handleZoomOut = () => {
    setZoom(Math.max(zoom - 1, 1))
  }

  const handleMarkerClick = (establishment: (typeof mockEstablishments)[0]) => {
    setSelectedEstablishment(establishment)
  }

  return (
    <div className="relative h-full w-full rounded-lg overflow-hidden">
      {loading ? (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          {/* Map container */}
          <div
            ref={mapContainerRef}
            className="h-full w-full bg-[url('/placeholder.svg?height=600&width=800')] bg-cover bg-center"
          >
            {/* Simulated markers */}
            {mockEstablishments.map((establishment) => (
              <div
                key={establishment.id}
                className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${((establishment.coordinates.lng + 180) / 360) * 100}%`,
                  top: `${((90 - establishment.coordinates.lat) / 180) * 100}%`,
                }}
                onClick={() => handleMarkerClick(establishment)}
              >
                <div className="flex flex-col items-center">
                  <div
                    className={`h-6 w-6 rounded-full bg-primary flex items-center justify-center ${selectedEstablishment?.id === establishment.id ? "ring-4 ring-primary/20" : ""}`}
                  >
                    <MapPin className="h-4 w-4 text-primary-foreground" />
                  </div>
                  {selectedEstablishment?.id === establishment.id && (
                    <span className="text-xs font-medium bg-background px-2 py-1 rounded-md shadow mt-1">
                      {establishment.name}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Map controls */}
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <Button variant="secondary" size="icon" onClick={handleZoomIn}>
              <Plus className="h-4 w-4" />
            </Button>
            <Button variant="secondary" size="icon" onClick={handleZoomOut}>
              <Minus className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="icon">
                  <Layers className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Carte standard</DropdownMenuItem>
                <DropdownMenuItem>Satellite</DropdownMenuItem>
                <DropdownMenuItem>Terrain</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Selected establishment info */}
          {selectedEstablishment && !preview && (
            <Card className="absolute bottom-4 left-4 w-80 shadow-lg">
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium">{selectedEstablishment.name}</h3>
                  <Badge variant="outline">{selectedEstablishment.type}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{selectedEstablishment.address}</p>
                <div className="flex justify-between text-sm mb-4">
                  <span>{selectedEstablishment.programs} formations</span>
                  <span>{selectedEstablishment.students.toLocaleString()} étudiants</span>
                </div>
                <Button className="w-full" asChild>
                  <Link href={`/establishments/${selectedEstablishment.id}`}>Voir les détails</Link>
                </Button>
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  )
}

