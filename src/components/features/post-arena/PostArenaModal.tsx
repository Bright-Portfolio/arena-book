import {
  Dialog,
  DialogPanel,
  DialogBackdrop,
  DialogTitle,
} from "@headlessui/react";
import { PostArenaForm } from "./PostArenaForm";

export const PostArenaModal = () => {
  return (
    <Dialog>
      <DialogPanel>
        <DialogTitle>
          <PostArenaForm />
        </DialogTitle>
      </DialogPanel>
    </Dialog>
  );
};
