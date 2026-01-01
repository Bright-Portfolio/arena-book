"use client";

import { FC } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useSession } from "next-auth/react";
import { AvatarButton } from "../ui/AvatarButton";

interface NavbarProps {
  onSignIn: () => void;
  onClickPost: () => void;
}

export const Navbar: FC<NavbarProps> = ({ onSignIn, onClickPost }) => {
  const session = useSession();

  return (
    <nav className="fixed top-0 z-50 flex flex-row mx-auto p-4 w-full bg-transparent items-center justify-between">
      {/* Left side navigation */}
      <div className="flex justify-start items-center gap-2 w-full text-black">
        <button className="px-1.5 py-1 border border-gray-300 rounded-full text-sm text-nowrap cursor-pointer hover:bg-white transition">
          About Us
        </button>
        <button className="px-1.5 py-1 border border-gray-300 rounded-full text-sm cursor-pointer hover:bg-white transition">
          Facilities
        </button>
      </div>
      {/* Right side navigation */}
      <div className="flex justify-end items-center gap-2 w-full text-sm">
        {/* Arena Listing */}
        <button
          onClick={onClickPost}
          className="flex flex-row justify-center items-center  gap-1 px-2 py-1.5 border border-gray-300 rounded-full text-sm cursor-pointer"
        >
          <PlusIcon className="w-5 h-5 stroke-2" />
          Post your arena
        </button>
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
