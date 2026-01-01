import { FC } from "react";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  DialogBackdrop,
} from "@headlessui/react";
import { PhoneInput } from "./PhoneInput";

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
          <form className="flex flex-col justify-center items-start gap-3 w-full">
            <div className="w-full">
              <label
                htmlFor="company-name-input"
                className="text-xs text-black"
              >
                company name
              </label>
              <input
                id="company-name-input"
                type="text"
                placeholder="Enter your company name"
                className="px-2 py-1 w-full border border-gray-300 rounded-lg outline-none focus:border-black"
              />
            </div>

            <PhoneInput label="company phone number" />

            <div className="w-full">
              <label htmlFor="address-input" className="text-xs text-black">
                address
              </label>
              <textarea
                id="address-input"
                placeholder="Enter your company address"
                className="px-2 py-1 w-full border border-gray-300 rounded-lg  focus:border-black resize-none outline-none"
              />
            </div>
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  );
};
