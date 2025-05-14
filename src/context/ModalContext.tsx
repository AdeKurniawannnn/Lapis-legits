'use client';

import React, { createContext, useContext, useState } from 'react';

type ModalType = null | 'about' | 'work' | 'values';

const ModalContext = createContext<{
  open: (type: ModalType) => void;
  close: () => void;
  modalType: ModalType;
}>({
  open: () => {},
  close: () => {},
  modalType: null,
});

export const useModal = () => useContext(ModalContext);

export const ModalProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [modalType, setModalType] = useState<ModalType>(null);

  const open = (type: ModalType) => setModalType(type);
  const close = () => setModalType(null);

  return (
    <ModalContext.Provider value={{ open, close, modalType }}>
      {children}
    </ModalContext.Provider>
  );
}; 