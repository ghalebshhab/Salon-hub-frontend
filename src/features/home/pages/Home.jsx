import CareerSection from "../components/CareerSection.jsx";
import HomeCtaSection from "../components/HomeCtaSection.jsx";
import HomeFaqSection from "../components/HomeFaqSection.jsx";
import HomeHero from "../components/HomeHero.jsx";
import OwnerExperienceSection from "../components/OwnerExperienceSection.jsx";
import PlatformFeaturesSection from "../components/PlatformFeaturesSection.jsx";
import SalonDiscoverySection from "../components/SalonDiscoverySection.jsx";

function Home() {
  return (
    <div className="editorial-home">
      <HomeHero />
      <SalonDiscoverySection />
      <PlatformFeaturesSection />
      <OwnerExperienceSection />
      <CareerSection />
      <HomeFaqSection />
      <HomeCtaSection />
    </div>
  );
}

export default Home;
