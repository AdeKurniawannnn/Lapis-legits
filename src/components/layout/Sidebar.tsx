'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const VerticalText = styled.div<{ $right?: boolean }>`
  position: fixed;
  top: 50%;
  ${props => props.$right ? 'right: -5px;' : 'left: auto;'}
  transform: translateY(-50%) rotate(${props => props.$right ? '-90deg' : '90deg'});
  font-size: 14px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--color-text-light);
  opacity: 0.7;
  z-index: 1000;
  mix-blend-mode: difference;
  cursor: pointer;
  white-space: nowrap;
  font-weight: 500;
  transition: opacity 0.3s ease;
  
  @media (max-width: 768px) {
    display: none;
  }

  &:hover {
    opacity: 1;
  }
`;

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  padding: 2rem;
  background-color: rgba(5, 5, 5, 0);
  backdrop-filter: blur(0px);
`;

const ModalText = styled(motion.div)`
  max-width: 1200px;
  width: 100%;
  position: relative;
  color: #fff;
  font-size: 4.5rem;
  line-height: 1.2;
  font-weight: 300;
  letter-spacing: 0.5px;
  padding: 6rem 8rem;

  p {
    margin: 2rem 0;
    font-size: 1.25rem;
    line-height: 1.8;
    opacity: 0.7;
  }

  .address {
    margin-top: 4rem;
    font-size: 1.1rem;
    opacity: 0.5;
    white-space: pre-line;
  }

  @media (max-width: 1024px) {
    font-size: 3.5rem;
    padding: 4rem;
    
    p {
      font-size: 1.1rem;
    }
  }

  @media (max-width: 768px) {
    font-size: 2.5rem;
    padding: 3rem 2rem;
    
    p {
      font-size: 1rem;
    }
    
    .address {
      font-size: 0.9rem;
    }
  }
`;

const CloseButton = styled(motion.button)`
  position: fixed;
  top: 2rem;
  right: 2rem;
  background: none;
  border: none;
  color: #fff;
  font-size: 2rem;
  cursor: pointer;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2001;
  opacity: 0;
`;

// Animasi variants
const overlayVariants = {
  hidden: {
    backgroundColor: 'rgba(5, 5, 5, 0)',
    backdropFilter: 'blur(0px)',
  },
  visible: {
    backgroundColor: 'rgba(5, 5, 5, 0.68)',
    backdropFilter: 'blur(8px)',
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
  exit: {
    backgroundColor: 'rgba(5, 5, 5, 0)',
    backdropFilter: 'blur(0px)',
    transition: {
      duration: 0.3,
      ease: 'easeIn',
    },
  },
};

const modalContentVariants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
    y: 20,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1], // custom ease curve
      delay: 0.1,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    y: -20,
    transition: {
      duration: 0.3,
      ease: 'easeIn',
    },
  },
};

const buttonVariants = {
  hidden: { 
    opacity: 0, 
    rotate: -180,
  },
  visible: { 
    opacity: 1,
    rotate: 0,
    transition: {
      duration: 0.5,
      delay: 0.2,
      ease: [0.16, 1, 0.3, 1],
    },
  },
  exit: { 
    opacity: 0,
    rotate: 180,
    transition: {
      duration: 0.3,
    },
  },
  hover: {
    rotate: 90,
    scale: 1.1,
    transition: {
      duration: 0.3,
    },
  },
};

const textVariants = {
  hidden: { 
    opacity: 0,
    y: 20,
  },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: custom * 0.1 + 0.3,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
  exit: { 
    opacity: 0,
    y: -10,
    transition: {
      duration: 0.2,
    },
  },
};

interface SidebarProps {
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
}

export default function Sidebar({ isModalOpen, setIsModalOpen }: SidebarProps) {
  const [modalContent, setModalContent] = useState({
    title: '',
    text: '',
    address: ''
  });

  const handleModalOpen = (isRight: boolean) => {
    if (isRight) {
      setModalContent({
        title: 'About Us',
        text: 'Lapis Visuals is a Jakarta-based production company founded in 2024, driven by a passion for storytelling and a deep respect for the filmmaking process. Our roots trace back to Burbank, California—the epicenter of Hollywood and the heartbeat of the film industry—where we studied film and developed a strong foundation in cinematic storytelling. With a team that holds extensive on-set experience across documentaries, short films, feature films, music videos, and commercials, we bring both versatility and depth to every project we take on.',
        address: 'Jakarta, Indonesia'
      });
    } else {
      setModalContent({
        title: 'Our Values',
        text: 'What sets Lapis Visuals apart is our core belief that storytelling should always lead the creative process. While we value striking visuals, every frame is crafted to serve the narrative. For us, aesthetics are powerful tools to elevate the emotion, meaning, and message behind each story. At Lapis Visuals, we don’t just produce content—we tell stories that connect, inspire, and endure.',
        address: 'Jl. Digital Creative No.123\nJakarta Selatan, Indonesia 12345\ninfo@lapisstudio.com\n+62 21 1234 5678'
      });
    }
    setIsModalOpen(true);
  };

  const handleModalClose = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    setIsModalOpen(false);
  };

  return (
    <>
      <VerticalText onClick={() => handleModalOpen(false)}>
        Our Values
      </VerticalText>
      <VerticalText $right onClick={() => handleModalOpen(true)}>
        About Us
      </VerticalText>

      <AnimatePresence mode="wait">
        {isModalOpen && (
          <ModalOverlay
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={handleModalClose}
          >
            <CloseButton
              variants={buttonVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              whileHover="hover"
              onClick={handleModalClose}
            >
              ×
            </CloseButton>
            
            <ModalText
              variants={modalContentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={e => e.stopPropagation()}
            >
              <motion.div
                variants={textVariants}
                custom={0}
              >
                {modalContent.title}
              </motion.div>
              <motion.p
                variants={textVariants}
                custom={1}
              >
                {modalContent.text}
              </motion.p>
              <motion.div
                className="address"
                variants={textVariants}
                custom={2}
              >
                {modalContent.address}
              </motion.div>
            </ModalText>
          </ModalOverlay>
        )}
      </AnimatePresence>
    </>
  );
}