import { Hero } from "@/components/home/hero";
import { FeaturedStudios } from "@/components/home/featured-studios";
import { Categories } from "@/components/home/categories";
import { HowItWorks } from "@/components/home/how-it-works";
import { HostPromotion } from "@/components/home/host-promotion";

const HomePage = () => {
  return (
    <>
      <Hero />
      <FeaturedStudios />
      <Categories />
      <HowItWorks />
      <HostPromotion />
    </>
  );
};

export default HomePage;
