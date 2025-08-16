import { CTASection } from "./_components/cta-section";
import { FeaturedEstablishmentsSection } from "./_components/featured-establishments-section";
import { HeroSection } from "./_components/hero-section";
import { InformationSection } from "./_components/information-section";
import { InteractiveMapSection } from "./_components/interactive-map-section";
import { KeyFeaturesSection } from "./_components/key-features-section";
import { TestimonialsSection } from "./_components/testimonials-section";

export default function HomePage() {
    return (
        <main className="bg-background min-h-screen">
            <HeroSection />
            <KeyFeaturesSection />
            <InteractiveMapSection />
            <FeaturedEstablishmentsSection />
            <TestimonialsSection />
            <InformationSection />
            <CTASection />
        </main>
    );
}
