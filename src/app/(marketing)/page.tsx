import { Suspense } from "react";
import { Hero } from "@/components/home/hero";
import { FeaturedStudios } from "@/components/home/featured-studios";
import { Categories } from "@/components/home/categories";
import { HowItWorks } from "@/components/home/how-it-works";
import { HostPromotion } from "@/components/home/host-promotion";
import { HeroSkeleton } from "@/components/home/hero-skeleton";
import { FeaturedStudiosSkeleton } from "@/components/home/featured-studios-skeleton";
import { CategoriesSkeleton } from "@/components/home/categories-skeleton";

const HomePage = () => {
  return (
    <>
      <Suspense fallback={<HeroSkeleton />}>
        <Hero />
      </Suspense>
      <Suspense fallback={<FeaturedStudiosSkeleton />}>
        <FeaturedStudios />
      </Suspense>
      <Suspense fallback={<CategoriesSkeleton />}>
        <Categories />
      </Suspense>
      <HowItWorks />
      <HostPromotion />
    </>
  );
};

export default HomePage;
