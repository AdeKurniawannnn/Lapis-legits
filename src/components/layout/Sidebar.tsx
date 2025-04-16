'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const VerticalText = styled.div<{ $right?: boolean; $center?: boolean; $offset?: number }>`
  position: fixed;
  top: ${props => props.$offset ? `${50 + props.$offset}%` : '50%'};
  ${props => props.$right ? 'right: 40px;' : 'left: 40px;'}
  transform-origin: ${props => props.$right ? 'right center' : 'left center'};
  transform: ${props => {
    if (props.$center) return 'translate(-50%, -50%) rotate(90deg)';
    return props.$right ? 'translateY(-50%) rotate(-90deg)' : 'translateY(-50%) rotate(90deg)';
  }};
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
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  @media (max-width: 768px) {
    font-size: 11px;
    letter-spacing: 1.5px;
    ${props => props.$right ? 'right: 30px;' : 'left: 30px;'}
  }

  @media (max-width: 480px) {
    font-size: 10px;
    letter-spacing: 1px;
    ${props => props.$right ? 'right: 25px;' : 'left: 25px;'}
  }

  &:hover {
    opacity: 1;
    transform: ${props => {
      if (props.$center) return 'translate(-50%, -50%) rotate(90deg) scale(1.1)';
      return props.$right ? 
        'translateY(-50%) rotate(-90deg) scale(1.1)' : 
        'translateY(-50%) rotate(90deg) scale(1.1)';
    }};
    letter-spacing: 3px;
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
  max-height: 90vh;
  overflow-y: auto;

  /* Styling untuk scrollbar */
  &::-webkit-scrollbar {
    width: 8px;
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 4px;
    
    &:hover {
      background-color: rgba(255, 255, 255, 0.3);
    }
  }

  /* Menyembunyikan scrollbar di Firefox */
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.2) rgba(255, 255, 255, 0.1);

  h1 {
    font-size: 4.5rem;
    margin-bottom: 2rem;
  }

  h2 {
    font-size: 3.5rem;
    margin: 4rem 0 2rem;
  }

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
    margin-bottom: 2rem;
  }

  @media (max-width: 1024px) {
    font-size: 3.5rem;
    padding: 4rem;
    
    h1 {
      font-size: 3.5rem;
    }

    h2 {
      font-size: 2.8rem;
    }
    
    p {
      font-size: 1.1rem;
    }
  }

  @media (max-width: 768px) {
    font-size: 2.5rem;
    padding: 3rem 2rem;
    
    h1 {
      font-size: 2.5rem;
    }

    h2 {
      font-size: 2rem;
    }
    
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
    subtitle: '',
    subtext: '',
    address: ''
  });

  const handleModalOpen = (type: 'work' | 'values' | 'about') => {
    const baseAddress = 'Jl. Digital Creative No.123\nJakarta Selatan, Indonesia 12345\ninfo@lapisstudio.com\n+62 21 1234 5678';
    
    if (type === 'about') {
      setModalContent({
        title: 'About Us',
        text: 'Lapis Visuals is a Jakarta-based production company founded in 2024, driven by a passion for storytelling and a deep respect for the filmmaking process. Our roots trace back to Burbank, California—the epicenter of Hollywood and the heartbeat of the film industry—where we studied film and developed a strong foundation in cinematic storytelling. With a team that holds extensive on-set experience across documentaries, short films, feature films, music videos, and commercials, we bring both versatility and depth to every project we take on.',
        subtitle: 'Our Values',
        subtext: 'What sets Lapis Visuals apart is our core belief that storytelling should always lead the creative process. While we value striking visuals, every frame is crafted to serve the narrative. For us, aesthetics are powerful tools to elevate the emotion, meaning, and message behind each story. At Lapis Visuals, we do not just produce content - we tell stories that connect, inspire, and endure.',
        address: baseAddress
      });
    } else if (type === 'values') {
      setModalContent({
        title: 'Our Values',
        text: 'What sets Lapis Visuals apart is our core belief that storytelling should always lead the creative process. While we value striking visuals, every frame is crafted to serve the narrative. For us, aesthetics are powerful tools to elevate the emotion, meaning, and message behind each story. At Lapis Visuals, we do not just produce content - we tell stories that connect, inspire, and endure.',
        subtitle: '',
        subtext: '',
        address: baseAddress
      });
    } else {
      setModalContent({
        title: 'Our Works',
        text: 'Explore our diverse portfolio of creative projects spanning various mediums and industries. From compelling documentaries to innovative commercial campaigns, each project reflects our commitment to authentic storytelling and visual excellence.',
        subtitle: '',
        subtext: '',
        address: baseAddress
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
      <VerticalText $offset={-15} onClick={() => handleModalOpen('work')}>
        Our Works
      </VerticalText>
      <VerticalText $right $offset={-15} onClick={() => handleModalOpen('values')}>
        Our Values
      </VerticalText>
      <VerticalText $right $offset={15} onClick={() => handleModalOpen('about')}>
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
              <motion.h1
                variants={textVariants}
                custom={0}
              >
                {modalContent.title}
              </motion.h1>
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
              {modalContent.subtitle && (
                <>
                  <motion.h2
                    variants={textVariants}
                    custom={3}
                    style={{ marginTop: '4rem', fontSize: '3rem' }}
                  >
                    {modalContent.subtitle}
                  </motion.h2>
                  <motion.p
                    variants={textVariants}
                    custom={4}
                  >
                    {modalContent.subtext}
                  </motion.p>
                  <motion.div
                    className="address"
                    variants={textVariants}
                    custom={5}
                  >
                    {modalContent.address}
                  </motion.div>
                </>
              )}
            </ModalText>
          </ModalOverlay>
        )}
      </AnimatePresence>
    </>
  );
}