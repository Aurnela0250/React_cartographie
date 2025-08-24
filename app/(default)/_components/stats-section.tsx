export default function StatsSection() {
    return (
        <section className="py-12">
            <div className="text-accent-foreground mx-auto max-w-5xl space-y-8 px-6 md:space-y-16">
                <div className="relative z-10 mx-auto max-w-2xl space-y-6 text-center">
                    <h2 className="text-4xl font-medium lg:text-5xl">
                        OrientationMada en nombre
                    </h2>
                    <p>
                        OrientationMada est une nouvelle plateforme qui regroupe
                        les établissements et les mentions disponibles à
                        Madagascar. Elle offre aux étudiants un accès centralisé
                        à ces informations pour simplifier leur processus de
                        décision.
                    </p>
                </div>

                <div className="grid gap-12 divide-y *:text-center md:grid-cols-3 md:gap-2 md:divide-x md:divide-y-0">
                    <div className="space-y-4">
                        <div className="text-primary text-5xl font-bold">
                            +150
                        </div>
                        <p>Etablissements</p>
                    </div>
                    <div className="space-y-4">
                        <div className="text-primary text-5xl font-bold">
                            +500
                        </div>
                        <p>Formations</p>
                    </div>
                    <div className="space-y-4">
                        <div className="text-primary text-5xl font-bold">
                            100%
                        </div>
                        <p>Vérifié</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
