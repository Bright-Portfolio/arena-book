"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { ChevronRightIcon, ChevronLeftIcon } from "@heroicons/react/24/outline";

const bannerSlides = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1714840961579-6b072a12536e?q=80&w=1490&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Tennis court banner",
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1473075109809-7a17d327bdf6?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Soccer court banner",
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=1490&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Basketball court banner",
  },
];

export const BannerSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide(
      (prev) => (prev - 1 + bannerSlides.length) % bannerSlides.length
    );
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  useEffect(() => {
    const intervalId = setInterval(nextSlide, 5000);

    return () => {
      clearInterval(intervalId);
    };
  }, [nextSlide, currentSlide]);

  return (
    <div className="relative w-full max-w-7xl aspect-[16/9] rounded-xl overflow-hidden group">
      {/* Slider container */}
      <div className="flex flex-row h-full transition-transform duration-500 ease-in-out">
        {bannerSlides.map((slider) => (
          <div
            key={slider.id}
            className="relative min-w-full h-full"
            style={{
              transform: `translateX(-${currentSlide * 100}%)`,
            }}
          >
            <Image
              src={slider.src}
              alt={slider.alt}
              fill
              priority
              className="object-cover"
            />
          </div>
        ))}
      </div>

      {/* Navidation arrow */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/70 cursor-pointer opacity-0 transition-opacity hover:bg-white group-hover:opacity-100"
      >
        <ChevronLeftIcon className="w-6 h-6 text-black" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/70 cursor-pointer opacity-0 transition-opacity hover:bg-white group-hover:opacity-100"
      >
        <ChevronRightIcon className="w-6 h-6 text-black" />
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-2 md:bottom-4 left-1/2 -translate-x-1/2 flex justify-center items-center gap-1">
        {bannerSlides.map((_slide, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-1 h-1 md:w-2 md:h-2 rounded-full transition-all cursor-pointer ${
              index === currentSlide
                ? "bg-white scale-120"
                : "bg-white/50 hover:bg-white/75"
            }`}
          />
        ))}
      </div>
    </div>
  );
};
