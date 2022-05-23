import React, { useEffect, useRef, useState } from "react";
import { ReactElement } from "react";
import { CloseButton, Modal, ModalContent } from "./PopUpModal.style";

interface Props {
  children: ReactElement;
  onClose: () => void;
}

const PopUpModal = ({ children, onClose }: Props) => {
  return (
    <Modal>
      <CloseButton onClick={onClose}>X</CloseButton>
      <ModalContent>{children}</ModalContent>
    </Modal>
  );
};

export default PopUpModal;
