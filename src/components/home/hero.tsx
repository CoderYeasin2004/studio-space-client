"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { Button } from "@/components/ui/button";
import { ApertureMark } from "@/components/brand/logo";
import type { Swiper as SwiperType } from "swiper";

/**
 * Homepage hero slider.
 *
 * Three full-bleed slides, each pairing a high-quality studio background
 * image with a dark gradient overlay, a category badge, a heading, a short
 * description and two CTAs. Powered by Swiper.js with autoplay, navigation
 * arrows, clickable pagination and touch/swipe support.
 */
const SLIDES = [
  {
    image: "/images/hero/photography.jpg",
    category: "Photography & Creative Spaces",
    heading: "Find the Perfect Space for Your Creative Vision",
    description:
      "Discover professional photography studios equipped to bring your ideas to life.",
    alt: "A photography studio lit with softboxes and a seamless backdrop",
  },
  {
    image: "/images/hero/podcast.jpg",
    category: "Podcast & Music Production",
    heading: "Create Something Worth Listening To",
    description:
      "Explore professional podcast lounges and recording studios for your next project.",
    alt: "A podcast recording studio with microphones and acoustic treatment",
  },
  {
    image: "/images/hero/film.jpg",
    category: "Film & Production",
    heading: "Your Next Great Production Starts Here",
    description:
      "Book cinematic spaces and professional sound stages for your creative productions.",
    alt: "A film production stage with lighting rigs and camera equipment",
  },
] as const;

/**
 * Slide height — tall enough to feel immersive, short enough to stay out of
 * the way of the rest of the homepage.
 */
const SLIDE_HEIGHT = "h-[58vh] lg:h-[64vh] max-h-[640px] lg:max-h-[720px]";

export const Hero = () => {
  // Stores the Swiper *instance* (not the DOM element). In swiper/react v14+,
  // `ref` on <Swiper> points to the swiper HTMLElement, which has no
  // slideNext/slidePrev/slideTo methods. The actual Swiper instance is only
  // exposed via the `onSwiper` callback, so we capture it there.
 const swiperRef = useRef<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

 const handleSwiper = useCallback((swiper: SwiperType) => {
  swiperRef.current = swiper;
}, []);

const handleSlideChange = useCallback((swiper: SwiperType) => {
  setActiveIndex(swiper.realIndex);
}, []);

  const handlePrev = useCallback(() => {
    swiperRef.current?.slidePrev();
  }, []);

  const handleNext = useCallback(() => {
    swiperRef.current?.slideNext();
  }, []);

  const handleSlideClick = useCallback((index: number) => {
    swiperRef.current?.slideTo(index);
  }, []);

  return (
    <section className="relative overflow-hidden pt-12 pb-16 lg:pt-16 lg:pb-20">
      <Swiper
        onSwiper={handleSwiper}
        modules={[Autoplay]}
        slidesPerView={1}
        spaceBetween={0}
        speed={700}
        grabCursor
        autoplay={{
          delay: 5000,
          disableOnInteraction: true,
          pauseOnMouseEnter: true,
        }}
        onSlideChange={handleSlideChange}
        className={`relative ${SLIDE_HEIGHT}`}
      >
        {SLIDES.map((slide, index) => (
          <SwiperSlide
            key={slide.category}
            aria-label={`Slide ${index + 1} of ${SLIDES.length}: ${slide.category}`}
          >
            <div className="relative h-full">
              <Image
                src={slide.image}
                alt={slide.alt}
                fill
                priority={index === 0}
                sizes="100vw"
                className="object-cover zoom-media"
              />

              {/* Dark gradient overlay so white text stays readable */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/60" />
              <div
                className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/25 to-transparent/60"
              />

              <div className="grain" />

              <div className="relative z-10 h-full flex items-center px-5 sm:px-8 lg:pl-12 lg:pr-24">
                <div className="max-w-[560px]">
                  <div
                    className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 backdrop-blur-sm text-white text-xs font-semibold tracking-wider uppercase"
                  >
                    <ApertureMark className="size-3.5 text-primary" />
                    {slide.category}
                  </div>

                  <h1 className="mt-4 font-heading text-[clamp(1.75rem,4.5vw,2.75rem)] leading-[1.05] font-semibold tracking-tight text-white sm:mt-6">
                    {slide.heading}
                  </h1>

                  <p className="mt-4 max-w-[480px] text-base leading-relaxed text-white/90 sm:text-lg sm:mt-5">
                    {slide.description}
                  </p>

                  <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
                    <Button
                      render={<Link href="/studios" />}
                      size="lg"
                      className="h-11 rounded-full px-7 text-[15px] font-medium"
                    >
                      Explore Studios
                      <ArrowRightIcon className="ml-1.5 size-4" />
                    </Button>
                    <Button
                      render={<Link href="/dashboard/my-listings/new-studios" />}
                      variant="outline"
                      size="lg"
                      className="h-11 rounded-full px-7 text-[15px] font-medium bg-transparent text-white border-white/40 hover:bg-white/20 hover:text-white"
                    >
                      Host Your Space
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div
        className="absolute inset-0 flex items-center justify-between px-4 sm:px-6 lg:px-12 z-20 pointer-events-none"
      >
        <button
          onClick={handlePrev}
          className="z-10 pointer-events-auto self-center h-10 w-10 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/60 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 transition-colors duration-200 sm:h-11 sm:w-11"
          aria-label="Previous slide"
          type="button"
        >
          <ArrowLeftIcon className="size-5 sm:size-6" />
        </button>
        <button
          onClick={handleNext}
          className="z-10 pointer-events-auto self-center h-10 w-10 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/60 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 transition-colors duration-200 sm:h-11 sm:w-11"
          aria-label="Next slide"
          type="button"
        >
          <ArrowRightIcon className="size-5 sm:size-6" />
        </button>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 sm:bottom-8 lg:bottom-10">
        {SLIDES.map((_, index) => (
          <button
            key={index}
            onClick={() => handleSlideClick(index)}
            className={`h-1.5 w-1.5 rounded-full bg-white/50 transition-all duration-300 ease-in-out ${activeIndex === index ? "w-6 bg-white" : ""} focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2`}
            aria-label={`Go to slide ${index + 1}`}
            type="button"
          />
        ))}
      </div>
    </section>
  );
};
