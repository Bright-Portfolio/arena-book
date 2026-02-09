"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout";
import { BannerSlider } from "@/components/features/home";
import { ArrowUpRightIcon } from "@heroicons/react/24/outline";
import { AuthForm } from "@/components/features/auth";
import { CompanyRegisterForm } from "@/components/features/company-register/company-register-form";
import { Modal } from "@/components/ui/modal";

export default function Home() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const { data: session, update } = useSession();
  const router = useRouter();

  const handleBookClick = () => {
    if (!session) {
      setShowAuthModal(true);
    }
  };

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
    <div className="flex min-h-screen items-center justify-center">
      <main className="flex min-h-screen w-full flex-col items-center justify-between">
        <div className="relative flex flex-col items-center justify-between w-full h-screen pt-20 pb-4 pr-4 pl-4">
          <Navbar
            onSignUp={() => setShowAuthModal(true)}
            onClickPost={handlePostClick}
          />
          {/* Slide Banner Background image */}
          <BannerSlider />
          {/* Temp booking button */}
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

          {/* <SearchBox /> */}
          <div>Search result here</div>
          <Modal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)}>
            <AuthForm onSuccess={() => setShowAuthModal(false)} />
          </Modal>
          <Modal
            isOpen={showRegisterModal}
            onClose={() => setShowRegisterModal(false)}
            title="Company Register Form"
          >
            <CompanyRegisterForm onSuccess={handleCompanyRegisterSuccess} />
          </Modal>
        </div>
      </main>
    </div>
  );
}
