"use client";

import { useRouter } from "next/navigation";
import { BannerSlider } from "@/components/features/home";
import { ArrowUpRightIcon } from "@heroicons/react/24/outline";

export default function HomePage() {
  const router = useRouter();

  const handleBookClick = () => {
    router.push("/explore");
  };

  return (
    <div
      className="relative flex flex-col items-center justify-start gap-4
         w-full pb-4 pr-4 pl-4"
    >
      {/* Slide Banner Background image */}
      <BannerSlider />
      {/* booking button */}
      <button
        type="button"
        onClick={handleBookClick}
        className="inline-flex flex-row items-center gap-2 px-2 py-1.5 border border-gray-300 rounded-full text-white bg-black cursor-pointer"
      >
        Book Now
        <div className="p-2 rounded-full bg-white">
          <ArrowUpRightIcon className="w-3 h-3 stroke-2 text-black" />
        </div>
      </button>
    </div>
  );
}
