"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Search, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface SearchFiltersProps {
  compact?: boolean
}

export function SearchFilters({ compact = false }: SearchFiltersProps) {
  const [activeFilters, setActiveFilters] = useState<string[]>([])

  const addFilter = (filter: string) => {
    if (!activeFilters.includes(filter)) {
      setActiveFilters([...activeFilters, filter])
    }
  }

  const removeFilter = (filter: string) => {
    setActiveFilters(activeFilters.filter((f) => f !== filter))
  }

  const clearFilters = () => {
    setActiveFilters([])
  }

  if (compact) {
    return (
      <div className="space-y-4">
        <div className="flex gap-2">
          <Input placeholder="Nom de l'établissement" />
          <Button size="icon">
            <Search className="h-4 w-4" />
          </Button>
        </div>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Région" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ile-de-france">Antananarivo</SelectItem>
            <SelectItem value="auvergne-rhone-alpes">Antananarivo</SelectItem>
            <SelectItem value="nouvelle-aquitaine">Antananarivo</SelectItem>
            <SelectItem value="occitanie">Antananarivo</SelectItem>
            <SelectItem value="hauts-de-france">Antananarivo</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Type d'établissement" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="universite">Université</SelectItem>
            <SelectItem value="grande-ecole">Grande École</SelectItem>
            <SelectItem value="ecole-ingenieur">Institue</SelectItem>
            <SelectItem value="ecole-commerce">Université</SelectItem>
            <SelectItem value="iut">IUT</SelectItem>
          </SelectContent>
        </Select>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Rechercher un établissement..." className="pl-8" />
        </div>

        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {activeFilters.map((filter) => (
              <Badge key={filter} variant="secondary" className="gap-1">
                {filter}
                <button
                  onClick={() => removeFilter(filter)}
                  className="ml-1 rounded-full outline-none focus:ring-2 focus:ring-offset-1"
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">Supprimer {filter}</span>
                </button>
              </Badge>
            ))}
            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={clearFilters}>
              Effacer tout
            </Button>
          </div>
        )}
      </div>

      <Accordion type="multiple" className="w-full">
        <AccordionItem value="location">
          <AccordionTrigger>Localisation</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-2">
              <Select onValueChange={(value) => addFilter(`Région: ${value}`)}>
                <SelectTrigger>
                  <SelectValue placeholder="Région" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Île-de-France">Antananarivo</SelectItem>
                  <SelectItem value="Auvergne-Rhône-Alpes">Antananarivo</SelectItem>
                  <SelectItem value="Nouvelle-Aquitaine">Antananarivo</SelectItem>
                  <SelectItem value="Occitanie">Antananarivo</SelectItem>
                  <SelectItem value="Hauts-de-France">Antananarivo</SelectItem>
                </SelectContent>
              </Select>

              <Select onValueChange={(value) => addFilter(`Ville: ${value}`)}>
                <SelectTrigger>
                  <SelectValue placeholder="Ville" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Paris">Antananarivo</SelectItem>
                  <SelectItem value="Lyon">Antananarivo</SelectItem>
                  <SelectItem value="Marseille">Antananarivo</SelectItem>
                  <SelectItem value="Toulouse">Antananarivo</SelectItem>
                  <SelectItem value="Bordeaux">Antananarivo</SelectItem>
                </SelectContent>
              </Select>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Distance maximale</Label>
                  <span className="text-sm">50 km</span>
                </div>
                <Slider defaultValue={[50]} max={100} step={5} />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="type">
          <AccordionTrigger>Type d'établissement</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 pt-2">
              {["Université", "Grande École", "Institut", "École de commerce", "IUT", "BTS", "CPGE"].map(
                (type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox
                      id={`type-${type}`}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          addFilter(`Type: ${type}`)
                        } else {
                          removeFilter(`Type: ${type}`)
                        }
                      }}
                    />
                    <Label htmlFor={`type-${type}`}>{type}</Label>
                  </div>
                ),
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="programs">
          <AccordionTrigger>Formations</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-2">
              <Select onValueChange={(value) => addFilter(`Domaine: ${value}`)}>
                <SelectTrigger>
                  <SelectValue placeholder="Domaine d'études" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Informatique">Informatique</SelectItem>
                  <SelectItem value="Droit">Droit</SelectItem>
                  <SelectItem value="Médecine">Médecine</SelectItem>
                  <SelectItem value="Commerce">Commerce</SelectItem>
                  <SelectItem value="Sciences">Sciences</SelectItem>
                  <SelectItem value="Lettres">Lettres</SelectItem>
                  <SelectItem value="Arts">Arts</SelectItem>
                </SelectContent>
              </Select>

              <Select onValueChange={(value) => addFilter(`Niveau: ${value}`)}>
                <SelectTrigger>
                  <SelectValue placeholder="Niveau d'études" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Bac+1">Bac+1</SelectItem>
                  <SelectItem value="Bac+2">Bac+2</SelectItem>
                  <SelectItem value="Bac+3">Bac+3</SelectItem>
                  <SelectItem value="Bac+4">Bac+4</SelectItem>
                  <SelectItem value="Bac+5">Bac+5</SelectItem>
                  <SelectItem value="Bac+8">Bac+8</SelectItem>
                </SelectContent>
              </Select>

              <Select onValueChange={(value) => addFilter(`Diplôme: ${value}`)}>
                <SelectTrigger>
                  <SelectValue placeholder="Type de diplôme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BTS">BTS</SelectItem>
                  <SelectItem value="BUT">BUT</SelectItem>
                  <SelectItem value="Licence">Licence</SelectItem>
                  <SelectItem value="Master">Master</SelectItem>
                  <SelectItem value="Diplôme d'ingénieur">Diplôme d'ingénieur</SelectItem>
                  <SelectItem value="Doctorat">Doctorat</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="additional">
          <AccordionTrigger>Critères supplémentaires</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 pt-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="accessible"
                  onCheckedChange={(checked) => {
                    if (checked) {
                      addFilter("Accessible PMR")
                    } else {
                      removeFilter("Accessible PMR")
                    }
                  }}
                />
                <Label htmlFor="accessible">Accessible PMR</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="international"
                  onCheckedChange={(checked) => {
                    if (checked) {
                      addFilter("Programmes internationaux")
                    } else {
                      removeFilter("Programmes internationaux")
                    }
                  }}
                />
                <Label htmlFor="international">Programmes internationaux</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="apprenticeship"
                  onCheckedChange={(checked) => {
                    if (checked) {
                      addFilter("Alternance")
                    } else {
                      removeFilter("Alternance")
                    }
                  }}
                />
                <Label htmlFor="apprenticeship">Alternance</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="residence"
                  onCheckedChange={(checked) => {
                    if (checked) {
                      addFilter("Résidence étudiante")
                    } else {
                      removeFilter("Résidence étudiante")
                    }
                  }}
                />
                <Label htmlFor="residence">Résidence étudiante</Label>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Button className="w-full">Appliquer les filtres</Button>
    </div>
  )
}

