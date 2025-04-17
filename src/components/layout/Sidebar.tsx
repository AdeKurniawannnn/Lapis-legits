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
  overflow-y: scroll;
  margin: auto;

  /* Styling untuk scrollbar - selalu terlihat */
  &::-webkit-scrollbar {
    -webkit-appearance: none;
    width: 10px !important;
    background-color: rgba(255, 255, 255, 0.05);
    display: block !important;
  }

  &::-webkit-scrollbar-thumb {
    -webkit-appearance: none;
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 5px;
    min-height: 50px;
    
    &:hover {
      background-color: rgba(255, 255, 255, 0.3);
    }
  }

  &::-webkit-scrollbar-track {
    -webkit-appearance: none;
    background-color: transparent;
  }

  article {
    margin: 2rem 0;
    display: flex;
    flex-direction: column;
    gap: 4rem;
  }

  h1 {
    font-size: 4.5rem;
    margin-bottom: 3rem;
  }

  h2 {
    font-size: 3.5rem;
    margin-bottom: 3rem;
  }

  p {
    margin: 2rem 0;
    font-size: 1.25rem;
    line-height: 1.8;
    opacity: 0.7;
  }

  .project-item {
    display: flex;
    gap: 2rem;
    align-items: flex-start;

    img {
      max-width: 40%;
      height: auto;
      border-radius: 4px;
    }

    p {
      margin: 0;
      font-size: 1.25rem;
      line-height: 1.8;
      opacity: 0.7;
    }
  }

  @media (max-width: 1024px) {
    font-size: 3.5rem;
    padding: 4rem;
    
    &::-webkit-scrollbar {
      width: 8px !important;
    }

    h1 {
      font-size: 3.5rem;
      margin-bottom: 2.5rem;
    }

    h2 {
      font-size: 2.8rem;
      margin-bottom: 2.5rem;
    }
    
    p {
      font-size: 1.1rem;
    }

    .project-item {
      flex-direction: column;
      
      img {
        max-width: 100%;
      }
    }
  }

  @media (max-width: 768px) {
    font-size: 2.5rem;
    padding: 3rem 2rem;
    
    &::-webkit-scrollbar {
      width: 6px !important;
    }

    h1 {
      font-size: 2.5rem;
      margin-bottom: 2rem;
    }

    h2 {
      font-size: 2rem;
      margin-bottom: 2rem;
    }
    
    p {
      font-size: 1rem;
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

const ArticleContent = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 4rem;
  margin: 2rem 0;

  .project-item {
    display: flex;
    gap: 2rem;
    align-items: flex-start;

    img {
      max-width: 40%;
      width: 100%;
      height: auto;
      border-radius: 4px;
      object-fit: cover;
      display: block;
    }

    p {
      margin: 0;
      font-size: 1.25rem;
      line-height: 1.8;
      opacity: 0.7;
      flex: 1;
    }
  }

  @media (max-width: 1024px) {
    .project-item {
      flex-direction: column;
      
      img {
        max-width: 100%;
      }
    }
  }
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

const sectionVariants = {
  hidden: { 
    opacity: 0,
    y: 50
  },
  visible: { 
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1]
    }
  }
};

const Section = styled(motion.div)`
  margin-top: 12rem;

  @media (max-width: 1024px) {
    margin-top: 10rem;
  }

  @media (max-width: 768px) {
    margin-top: 8rem;
  }
`;

interface ModalContent {
  title: string;
  text: string;
  subtitle?: string;
  subtext?: string;
  address: string;
  type: 'work' | 'values' | 'about';
  extraTitle?: string;
  extraContent?: React.ReactNode;
}

interface SidebarProps {
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
}

export default function Sidebar({ isModalOpen, setIsModalOpen }: SidebarProps) {
  const [modalContent, setModalContent] = useState<ModalContent>({
    title: '',
    text: '',
    subtitle: '',
    subtext: '',
    address: '',
    type: 'about'
  });

  const handleModalOpen = (type: 'work' | 'values' | 'about') => {
    const baseAddress = 'Jl. Digital Creative No.123\nJakarta Selatan, Indonesia 12345\ninfo@lapisstudio.com\n+62 21 1234 5678';
    
    if (type === 'about') {
      setModalContent({
        title: 'About Us',
        text: 'Lapis Visuals is a Jakarta-based production company founded in 2024, driven by a passion for storytelling and a deep respect for the filmmaking process. Our roots trace back to Burbank, California—the epicenter of Hollywood and the heartbeat of the film industry—where we studied film and developed a strong foundation in cinematic storytelling. With a team that holds extensive on-set experience across documentaries, short films, feature films, music videos, and commercials, we bring both versatility and depth to every project we take on.',
        subtitle: 'Our Values',
        subtext: 'What sets Lapis Visuals apart is our core belief that storytelling should always lead the creative process. While we value striking visuals, every frame is crafted to serve the narrative. For us, aesthetics are powerful tools to elevate the emotion, meaning, and message behind each story. At Lapis Visuals, we do not just produce content - we tell stories that connect, inspire, and endure.',
        extraTitle: 'Awards & Recognition',
        extraContent: (
          <ArticleContent>
            <div className="project-item">
              <img src="/images/portfolio/BEST SHORT FILM DIRECTOR - Asian Film Festival Los Angeles Hollywood - 2023 (1).png" alt="Best Short Film Director Award" />
              <p>Best Short Film Director - Asian Film Festival Los Angeles Hollywood 2023</p>
            </div>
            <div className="project-item">
              <img src="/images/portfolio/ISA_HM_Jul23_-_Golden.png" alt="Independent Shorts Awards" />
              <p>Honorable Mention Award - Independent Shorts Awards (ISA) July 2023</p>
            </div>
            <div className="project-item">
              <img src="/images/portfolio/LA Official Selection (W).png" alt="LA Film Awards Selection" />
              <p>Official Selection - Los Angeles Film Awards 2023</p>
            </div>
            <div className="project-item">
              <img src="/images/portfolio/New York Laurels 2024 (W).png" alt="New York Film Awards" />
              <p>Official Selection - New York Film Awards 2024</p>
            </div>
          </ArticleContent>
        ),
        address: '',
        type: 'about'
      });
    } else if (type === 'values') {
      setModalContent({
        title: 'Our Values',
        text: 'What sets Lapis Visuals apart is our core belief that storytelling should always lead the creative process. While we value striking visuals, every frame is crafted to serve the narrative. For us, aesthetics are powerful tools to elevate the emotion, meaning, and message behind each story. At Lapis Visuals, we do not just produce content - we tell stories that connect, inspire, and endure.',
        subtitle: '',
        subtext: '',
        address: '',
        type: 'values'
      });
    } else {
      setModalContent({
        title: 'Our Works',
        text: '',
        subtitle: '',
        subtext: '',
        extraContent: (
          <ArticleContent>
            <article>
              <div className="project-item">
                <img src="/images/portfolio/Ballin.jpg" alt="Ballin Project Preview" />
                <p>Maybe we can live without libraries, people like you and me. Maybe some of us can afford to buy every book we want, but the vast majority of people in this country cannot. When you are growing up there are a lot of people who go to the library who don't have the money to buy books. If you are a kid growing up in a home you are lucky if you have one or two books of your own.</p>
              </div>
            </article>
            <article>
              <div className="project-item">
                <img src="/images/portfolio/Think you say .jpg" alt="Think You Say Project" />
                <p>Maybe we can live without libraries, people like you and me. Maybe some of us can afford to buy every book we want, but the vast majority of people in this country cannot. When you are growing up there are a lot of people who go to the library who don't have the money to buy books. If you are a kid growing up in a home you are lucky if you have one or two books of your own.</p>
              </div>
            </article>
            <article>
              <div className="project-item">
                <img src="/images/portfolio/rembulan.jpg" alt="Rembulan Project" />
                <p>Maybe we can live without libraries, people like you and me. Maybe some of us can afford to buy every book we want, but the vast majority of people in this country cannot. When you are growing up there are a lot of people who go to the library who don't have the money to buy books. If you are a kid growing up in a home you are lucky if you have one or two books of your own.</p>
              </div>
            </article>
          </ArticleContent>
        ),
        address: '',
        type: 'work'
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
      {/* <VerticalText $right $offset={-15} onClick={() => handleModalOpen('values')}>
        Our Values
      </VerticalText> */}
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
              <motion.div
                variants={textVariants}
                custom={0}
              >
                <motion.h1>
                  {modalContent.title}
                </motion.h1>
                {modalContent.text && (
                  <motion.p>
                    {modalContent.text}
                  </motion.p>
                )}
                {modalContent.type === 'work' && modalContent.extraContent}
              </motion.div>

              {modalContent.subtitle && modalContent.type !== 'work' && (
                <Section
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-100px" }}
                  variants={sectionVariants}
                >
                  <motion.h2>
                    {modalContent.subtitle}
                  </motion.h2>
                  <motion.p>
                    {modalContent.subtext}
                  </motion.p>
                </Section>
              )}

              {modalContent.extraTitle && (
                <Section
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-100px" }}
                  variants={sectionVariants}
                >
                  <motion.h2>
                    {modalContent.extraTitle}
                  </motion.h2>
                  {modalContent.extraContent}
                </Section>
              )}
            </ModalText>
          </ModalOverlay>
        )}
      </AnimatePresence>
    </>
  );
}