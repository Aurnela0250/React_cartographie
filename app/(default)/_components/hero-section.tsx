import { Separator } from "@/presentation/components/ui/separator";

import { CitySelector } from "./city-selector";
import { DomainSelector } from "./domain-selector";
import { LevelSelector } from "./level-selector";
import { SearchButton } from "./search-button";
import StatsSection from "./stats-section";

export function HeroSection() {
    return (
        <section
            aria-labelledby="hero-title"
            className="bg-accent min-h-screen space-y-10 overflow-hidden px-4 sm:px-6 lg:px-8"
        >
            {/* 1) Presentation Text */}
            <div className="mx-auto max-w-4xl text-center">
                <h1
                    className="text-primary mb-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl"
                    id="hero-title"
                >
                    Votre avenir commence ici
                </h1>
                <p className="text-accent-foreground mb-8 text-xl md:text-2xl">
                    Découvrez et comparez les meilleures formations et
                    établissements d'enseignement supérieur à Madagascar
                </p>
            </div>

            {/* 2) Search Component */}
            <div className="mx-auto w-full max-w-4xl">
                <div className="bg-card w-full rounded-lg border p-2 shadow-sm md:rounded-full">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-4 lg:items-end">
                        <CitySelector />
                        <DomainSelector />
                        <LevelSelector />
                        <SearchButton />
                    </div>
                </div>
            </div>

            {/* 3) Quick Stats */}
            <StatsSection />
        </section>
    );
}
