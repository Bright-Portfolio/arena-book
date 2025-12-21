"use client";

import { useState } from "react";
import Image from "next/image";
// import SearchBox from "./searchBox";
import Navbar from "./navbar";
import { AuthModal } from "./auth/AuthModal";

const HomePage = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  return (
    <div className="relative flex flex-col items-center justify-between w-full h-screen pt-14 pb-4 pr-4 pl-4">
      <Navbar />
      {/* Slide Banner Background image */}
      <div className="relative z-10 w-full h-[600px] rounded-lg overflow-hidden bg-red-100">
        <Image
          src="/images/tennis-banner-bg.jpg"
          alt="Tennis court background"
          fill
          priority
          quality={90}
          className="object-contain"
        />
      </div>
      {/* Temp booking button */}
      <button
        onClick={() => setShowAuthModal(true)}
        className="p-1 rounded-full text-white bg-black cursor-pointer"
      >
        Book Now
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
