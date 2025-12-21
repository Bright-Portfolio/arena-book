"use client";

import { FC } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import { AuthForm } from "./AuthForm";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const onSuccess = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      {/* Backdrop */}
      <div className="fixed inset-0 flex justify-center items-center w-screen px-4 bg-gray-50/30 backdrop-blur-md">
        <DialogPanel className=" space-y-4 w-full max-w-lg px-4 py-6 border border-gray-200 rounded-lg bg-white">
          {/* Form */}
          <AuthForm onSuccess={onSuccess} />
        </DialogPanel>
      </div>
    </Dialog>
  );
};
