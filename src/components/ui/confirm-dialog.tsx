import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  cancelLabel?: string;
  confirmLabel?: string;
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  cancelLabel = "Cancel",
  confirmLabel = "Confirm",
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-black/30" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-sm rounded-lg bg-white p-6 shadow-xl">
          <DialogTitle className="text-lg font-semibold">{title}</DialogTitle>
          <p className="mt-2 text-sm text-gray-600">{description}</p>
          <div className="mt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50 cursor-pointer"
            >
              {cancelLabel}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="rounded-md bg-red-600 px-3 py-1.5 text-sm text-white hover:bg-red-700 cursor-pointer"
            >
              {confirmLabel}
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
