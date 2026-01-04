import { FC } from "react";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  DialogBackdrop,
} from "@headlessui/react";
import { CompanyRegisterForm } from "./CompanyRegisterForm";

interface CompanyRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CompanyRegisterModal: FC<CompanyRegisterModalProps> = ({
  isOpen,
  onClose,
}) => {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-white/30 backdrop-blur-xs"
      />
      <div className="fixed inset-0 flex flex-row w-screen items-center justify-center p-4">
        <DialogPanel className="max-w-lg w-full rounded-lg bg-white p-4 ease-out transition-all data-closed:opacity-0 data-closed:scale-95">
          <DialogTitle className="text-center text-lg font-semibold">
            Company Register Form
          </DialogTitle>
          {/* Form */}
          <CompanyRegisterForm />
        </DialogPanel>
      </div>
    </Dialog>
  );
};
