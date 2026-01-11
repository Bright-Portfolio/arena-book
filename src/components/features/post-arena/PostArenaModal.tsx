import {
  Dialog,
  DialogPanel,
  DialogBackdrop,
  DialogTitle,
} from "@headlessui/react";
import { PostArenaForm } from "./PostArenaForm";
import { FC } from "react";

interface PostArenaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PostArenaModal: FC<PostArenaModalProps> = ({
  isOpen,
  onClose,
}) => {
  const onSuccess = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogPanel>
        <DialogTitle>
          <PostArenaForm />
        </DialogTitle>
      </DialogPanel>
    </Dialog>
  );
};
