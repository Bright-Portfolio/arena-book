import { ArrowUpRightIcon } from "@heroicons/react/24/outline";

const Navbar = () => {
  return (
    <nav className="fixed inset-0 z-50 flex flex-row mx-auto px-4 py-1 w-full h-14 bg-transparent items-center justify-between">
      {/* Left side navigation */}
      <div className="flex justify-start items-center gap-2 w-full text-black">
        <button className="px-2 py-1.5 border border-gray-300 rounded-full cursor-pointer hover:bg-white transition">
          About Us
        </button>
        <button className="px-2 py-1.5 border border-gray-300 rounded-full cursor-pointer hover:bg-white transition">
          Facilities
        </button>
      </div>
      {/* Right side navigation */}
      <div className="flex justify-end items-center w-full">
        <button
          type="button"
          className="inline-flex flex-row items-center gap-2 px-2 py-1.5 border border-gray-300 rounded-full text-white bg-black cursor-pointer"
        >
          Book Now
          <div className="p-2 rounded-full bg-white">
            <ArrowUpRightIcon className="w-3 h-3 stroke-2 text-black" />
          </div>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
