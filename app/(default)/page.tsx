import { HeroSection } from "./components/hero-section";
import { KeyFeaturesSection } from "./components/key-features-section";
import { InteractiveMapSection } from "./components/interactive-map-section";
import { FeaturedEstablishmentsSection } from "./components/featured-establishments-section";
import { TestimonialsSection } from "./components/testimonials-section";
import { InformationSection } from "./components/information-section";
import { CTASection } from "./components/cta-section";

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
