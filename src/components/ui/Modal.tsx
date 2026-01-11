"use client";

import { FC, ReactNode } from "react";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  DialogBackdrop,
} from "@headlessui/react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export const Modal: FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-white/30 backdrop-blur-xs"
      />
      <div className="fixed inset-0 flex flex-row w-screen items-center justify-center p-4">
        <DialogPanel className="max-w-lg w-full rounded-lg bg-white p-4 ease-out shadow-2xl transition-all data-closed:opacity-0 data-closed:scale-95">
          {title && (
            <DialogTitle className="text-center text-lg font-semibold">
              {title}
            </DialogTitle>
          )}

          {children}
        </DialogPanel>
      </div>
    </Dialog>
  );
};
