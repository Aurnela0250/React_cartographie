"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Users, BookOpen, Star, Building } from "lucide-react"
import Link from "next/link"
import Etablissements from '@/components/ListeEtablissements';

const mockEstablishments = [
  {
    id: "1",
    name: "Université d'Antananarivo",
    type: "Université",
    address: "Ankatso, Antananarivo",
    region: "Analamanga",
    programs: 350,
    students: 48000,
    rating: 4.2,
    image: "/placeholder.svg?height=100&width=150",
  },
  {
    id: "2",
    name: "École Polytechnique",
    type: "Grande École",
    address: "Vontovorona, Anatananarivo",
    region: "Analamanga",
    programs: 120,
    students: 3000,
    rating: 4.8,
    image: "/placeholder.svg?height=100&width=150",
  },
  {
    id: "3",
    name: "ESMIA ",
    type: "Université",
    address: "Mahamasina, Antananarivo",
    region: "Analamanga",
    programs: 400,
    students: 55000,
    rating: 4.5,
    image: "/placeholder.svg?height=100&width=150",
  },
  {
    id: "4",
    name: "IEP",
    type: "Institut",
    address: "Ampasanimalo",
    region: "Analamanga",
    programs: 80,
    students: 14000,
    rating: 4.6,
    image: "/placeholder.svg?height=100&width=150",
  },
  {
    id: "5",
    name: "INSCAE",
    type: "Institue",
    address: "67Ha, Antananarivo",
    region: "Analamanga",
    programs: 90,
    students: 6000,
    rating: 4.3,
    image: "/placeholder.svg?height=100&width=150",
  },
]

export function EstablishmentList() {
  const [establishments] = useState(mockEstablishments)

  return (
    <div className="space-y-4">
      {establishments.map((establishment) => (
        <Card key={establishment.id} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex flex-col md:flex-row">
              <div className="w-full md:w-1/4 h-40 md:h-auto">
                <div
                  className="h-full w-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${establishment.image})` }}
                />
              </div>
              <div className="flex-1 p-4 md:p-6">
                <div className="flex flex-col md:flex-row justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline">{establishment.type}</Badge>
                      <Badge variant="secondary">{establishment.region}</Badge>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{establishment.name}</h3>
                    <div className="flex items-center text-muted-foreground mb-4">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="text-sm">{establishment.address}</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-1 mt-2 md:mt-0">
                    <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                    <span className="font-medium">{establishment.rating}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center">
                    <Building className="h-5 w-5 text-muted-foreground mr-2" />
                    <div>
                      <p className="text-sm font-medium">Type</p>
                      <p className="text-sm text-muted-foreground">{establishment.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <BookOpen className="h-5 w-5 text-muted-foreground mr-2" />
                    <div>
                      <p className="text-sm font-medium">Formations</p>
                      <p className="text-sm text-muted-foreground">{establishment.programs} programmes</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-muted-foreground mr-2" />
                    <div>
                      <p className="text-sm font-medium">Étudiants</p>
                      <p className="text-sm text-muted-foreground">{establishment.students.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 mt-2">
                  <Button variant="outline" className="sm:flex-1" asChild>
                    <Link href={`/map?id=${establishment.id}`}>Voir sur la carte</Link>
                  </Button>
                  <Button className="sm:flex-1" asChild>
                    <Link href={`/establishments/${establishment.id}`}>Détails de l'établissement</Link>
                  </Button>
                </div>
              </div>
            </div>

            <div>
              <Etablissements />
            </div>
          </CardContent>
        </Card>

        
      ))}
    </div>
  )
}

