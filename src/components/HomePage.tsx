"use client";

import { useState } from "react";
import { ArrowUpRightIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
// import SearchBox from "./searchBox";
import Navbar from "./Navbar";
import { AuthModal } from "./auth/AuthModal";

const HomePage = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  return (
    <div className="relative flex flex-col items-center justify-between w-full h-screen pt-14 pb-4 pr-4 pl-4">
      <Navbar onSignIn={() => setShowAuthModal(true)} />
      {/* Slide Banner Background image */}
      <div className="relative z-10 mt-10 w-full h-full min-h-10 rounded-lg overflow-hidden bg-red-100">
        <Image
          src="/images/tennis-banner.jpg"
          alt="Tennis court background"
          fill
          priority
          quality={90}
          className="object-contain"
        />
      </div>
      {/* Temp booking button */}

      <button
        type="button"
        onClick={() => setShowAuthModal(true)}
        className="inline-flex flex-row items-center gap-2 px-2 py-1.5 border border-gray-300 rounded-full text-white bg-black cursor-pointer"
      >
        Book Now
        <div className="p-2 rounded-full bg-white">
          <ArrowUpRightIcon className="w-3 h-3 stroke-2 text-black" />
        </div>
      </button>

      {/* <SearchBox /> */}
      <div>Search result here</div>
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
};

export default HomePage;
