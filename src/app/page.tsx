import { HeroSection } from "@/components/blocks/home/hero";
import { StatsSection } from "@/components/blocks/home/stats";
import { AboutSection } from "@/components/blocks/home/about";
import { FeaturesSection } from "@/components/blocks/home/features";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <StatsSection />
      <AboutSection />
      <FeaturesSection />
    </div>
  );
}
