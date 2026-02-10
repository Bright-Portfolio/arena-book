"use client";

import { useState } from "react";
import { PlusIcon, HomeIcon } from "@heroicons/react/24/outline";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { AvatarButton } from "../ui/avatar-button";
import { Modal } from "../ui/modal";
import { AuthForm } from "../features/auth";
import { CompanyRegisterForm } from "../features/company-register/company-register-form";

export const Navbar = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const { data: session, update } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const handlePostClick = () => {
    if (!session) {
      setShowAuthModal(true);
      return;
    }

    if (session.user.role !== "owner") {
      setShowRegisterModal(true);
      return;
    }

    router.push("/arena/add");
  };

  const handleCompanyRegisterSuccess = async () => {
    setShowRegisterModal(false);
    await update();
    router.push("/arena/add");
  };

  return (
    <>
      <nav className="fixed top-0 z-50 flex flex-row mx-auto p-4 w-full bg-transparent items-center justify-between">
        {/* Home button */}
        {pathname !== "/" && (
          <button
            type="button"
            aria-label="home-button"
            onClick={() => router.push("/")}
            className="p-1 cursor-pointer"
          >
            <HomeIcon className="size-5 stroke-2" />
          </button>
        )}

        {/* Right side navigation */}
        <div className="flex justify-end items-center gap-2 w-full text-sm">
          {/* Arena Listing */}
          {session && (
            <button
              type="button"
              onClick={handlePostClick}
              className="flex flex-row justify-center items-center  gap-1 px-2 py-1.5 border border-gray-300 rounded-full text-sm cursor-pointer"
            >
              <PlusIcon className="w-5 h-5 stroke-2" />
              Add arena
            </button>
          )}
          {session ? (
            <AvatarButton />
          ) : (
            <button
              type="button"
              onClick={() => setShowAuthModal(true)}
              className="inline-flex flex-row items-center gap-2 px-2 py-1.5 border border-gray-300 rounded-full text-white bg-black cursor-pointer"
            >
              Sign Up
            </button>
          )}
        </div>
      </nav>

      {/* Auth form modal */}
      <Modal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)}>
        <AuthForm onSuccess={() => setShowAuthModal(false)} />
      </Modal>

      {/* Company register form modal */}
      <Modal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        title="Company Register Form"
      >
        <CompanyRegisterForm onSuccess={handleCompanyRegisterSuccess} />
      </Modal>
    </>
  );
};
