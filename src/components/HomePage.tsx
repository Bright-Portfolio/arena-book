"use client";

import Image from "next/image";
// import SearchBox from "./searchBox";
import Navbar from "./navbar";

const HomePage = () => {
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
      {/* <SearchBox /> */}
      <div>Search result here</div>
    </div>
  );
};

export default HomePage;
