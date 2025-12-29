import { FC } from "react";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  DialogBackdrop,
} from "@headlessui/react";

interface CompanyRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CompanyRegisterModal: FC<CompanyRegisterModalProps> = ({
  isOpen,
  onClose,
}) => {
  return (
    <div>
      <Dialog open={isOpen} onClose={onClose} className="relative z-50">
        <DialogBackdrop transition className="fixed inset-0 bg-red-100">
          <DialogPanel>
            <DialogTitle>Company Register Form</DialogTitle>
            <form>
              <input type="text" placeholder="Company name" />
              <input type="number" />
              <textarea placeholder="address" />
            </form>
          </DialogPanel>
        </DialogBackdrop>
      </Dialog>
    </div>
  );
};
