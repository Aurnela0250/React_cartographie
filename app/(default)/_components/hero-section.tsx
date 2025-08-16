import { CitySelector } from "./city-selector";
import { DomainSelector } from "./domain-selector";
import { LevelSelector } from "./level-selector";
import { SearchButton } from "./search-button";

export function HeroSection() {
    return (
        <section
            aria-labelledby="hero-title"
            className="from-primary/5 to-secondary/10 relative isolate overflow-hidden bg-gradient-to-br pt-16 pb-24 md:pt-20 md:pb-32"
        >
            <div
                aria-hidden="true"
                className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
            >
                <div
                    style={{
                        clipPath:
                            "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
                    }}
                    className="to-primary/15 from-primary/10 relative left-[calc(50%-11rem)] aspect-1155/678 w-144.5 -translate-x-1/2 rotate-30 bg-linear-to-tr opacity-30 sm:left-[calc(50%-30rem)] sm:w-288.75"
                />
            </div>
            <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-4xl text-center">
                    <h1
                        className="text-primary mb-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl"
                        id="hero-title"
                    >
                        Votre avenir commence ici
                    </h1>
                    <p className="text-muted-foreground mb-8 text-xl md:text-2xl">
                        Découvrez et comparez les meilleures formations et
                        établissements d'enseignement supérieur à Madagascar
                    </p>

                    {/* Search Component */}
                    <div className="mx-auto mb-8 max-w-6xl">
                        <div className="relative">
                            <div className="bg-card rounded-lg border p-6 shadow-sm">
                                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:gap-4">
                                    <div className="min-w-0 flex-1">
                                        <CitySelector />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <DomainSelector />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <LevelSelector />
                                    </div>
                                    <div className="flex-shrink-0 lg:max-w-60">
                                        <SearchButton />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                        <div className="bg-card rounded-lg p-4 shadow-sm">
                            <p className="text-primary text-3xl font-bold">
                                150+
                            </p>
                            <p className="text-muted-foreground text-sm">
                                Établissements
                            </p>
                        </div>
                        <div className="bg-card rounded-lg p-4 shadow-sm">
                            <p className="text-primary text-3xl font-bold">
                                500+
                            </p>
                            <p className="text-muted-foreground text-sm">
                                Formations
                            </p>
                        </div>
                        <div className="bg-card rounded-lg p-4 shadow-sm">
                            <p className="text-primary text-3xl font-bold">
                                25+
                            </p>
                            <p className="text-muted-foreground text-sm">
                                Villes
                            </p>
                        </div>
                        <div className="bg-card rounded-lg p-4 shadow-sm">
                            <p className="text-primary text-3xl font-bold">
                                10k+
                            </p>
                            <p className="text-muted-foreground text-sm">
                                Étudiants
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
