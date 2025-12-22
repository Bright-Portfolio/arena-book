"use client";

import { FC } from "react";
import { useSession } from "next-auth/react";
import { AvatarButton } from "./AvatarButton";

interface NavbarProps {
  onSignIn: () => void;
}

const Navbar: FC<NavbarProps> = ({ onSignIn }) => {
  const { data: session } = useSession();

  return (
    <nav className="fixed top-0 z-50 flex flex-row mx-auto px-4 py-3 w-full bg-transparent items-center justify-between">
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
        {session ? (
          <AvatarButton />
        ) : (
          <button
            type="button"
            onClick={onSignIn}
            className="inline-flex flex-row items-center gap-2 px-2 py-1.5 border border-gray-300 rounded-full text-white bg-black cursor-pointer"
          >
            Sign In
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
