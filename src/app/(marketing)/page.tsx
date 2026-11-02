import { Hero } from "@/components/home/hero";
import { FeaturedStudios } from "@/components/home/featured-studios";
import { Categories } from "@/components/home/categories";

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedStudios />
      <Categories />
    </>
  );
}
