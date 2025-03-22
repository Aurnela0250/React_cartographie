import { Button } from "@/presentation/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/presentation/components/ui/card"
import { MapExplorer } from "@/presentation/components/features/map-explorer"
import { SearchFilters } from "@/presentation/components/features/search-filters"
import { FeaturedEstablishments } from "@/presentation/components/features/featured-establishments"
import { RecommendationSection } from "@/presentation/components/features/recommendation-section"
import { Stats } from "@/presentation/components/features/stats"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="space-y-8">
      <section className="relative h-[500px] rounded-lg overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/40 z-10" />
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=500&width=1200')] bg-cover bg-center" />
        <div className="relative z-20 flex flex-col items-center justify-center h-full text-center p-6">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Trouvez votre voie dans l'enseignement supérieur
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mb-8">
            Explorez les établissements, découvrez les formations et construisez votre avenir académique
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" asChild>
              <Link href="/map">Explorer la carte</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-white/10 text-white border-white/20 hover:bg-white/20"
              asChild
            >
              <Link href="/establishments">Voir les établissements</Link>
            </Button>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recherche avancée</CardTitle>
            <CardDescription>Filtrez par région, type et formation</CardDescription>
          </CardHeader>
          <CardContent>
            <SearchFilters compact />
            <Button className="w-full mt-4" asChild>
              <Link href="/search">Recherche complète</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Carte interactive</CardTitle>
            <CardDescription>Explorez les établissements par localisation</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <MapExplorer preview />
          </CardContent>
        </Card>
      </div>

      <FeaturedEstablishments />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecommendationSection />
        <Stats />
      </div>
    </div>
  )
}

