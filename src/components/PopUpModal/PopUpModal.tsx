import React from "react";
import { ReactElement } from "react";
import { CloseButton, Modal, ModalContent } from "./PopUpModal.style";

interface Props {
  closeButton?: boolean;
  children: ReactElement;
  onClose:()=> void;
}

const PopUpModal = ({ children, closeButton = true, onClose }: Props) => {
  return (
    <Modal>
      { closeButton && <CloseButton onClick={onClose}>X</CloseButton>}
      <ModalContent>{children}</ModalContent>
    </Modal>
  );
};

export default PopUpModal;
