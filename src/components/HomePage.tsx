import Image from "next/image";
import SearchBox from "./searchBox";

const HomePage = () => {
  return (
    <div className="relative w-full h-screen">
      {/* Background image */}
      <Image
        src="/images/tennis-hero-bg.jpg"
        alt="Tennis court background"
        fill
        priority
        quality={90}
        className="object-cover"
      />
      <div className="relative z-10 flex flex-col items-center justify-between w-full h-screen p-4">
        <div>Banners Section</div>
        <SearchBox />
        <div>Search result here</div>
      </div>
    </div>
  );
};

export default HomePage;
