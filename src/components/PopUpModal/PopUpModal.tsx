import React from "react";
import { ReactElement } from "react";
import { CloseButton, Modal, ModalContent } from "./PopUpModal.style";

interface Props {
  error: boolean;
  children: ReactElement;
  onClose:()=> void;
}

const PopUpModal = ({ children, error, onClose }: Props) => {
  return (
    <Modal>
      { error && <CloseButton onClick={onClose}>X</CloseButton>}
      <ModalContent>{children}</ModalContent>
    </Modal>
  );
};

export default PopUpModal;
