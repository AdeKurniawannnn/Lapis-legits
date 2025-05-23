'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

const VerticalText = styled.div<{ $right?: boolean; $center?: boolean; $offset?: number }>`
  position: fixed;
  top: ${props => props.$offset ? `${50 + props.$offset}%` : '50%'};
  ${props => props.$right ? 'right: -25px;' : 'left: -25px;'}
  transform-origin: center;
  transform: ${props => {
    if (props.$center) return 'translate(-50%, -50%) rotate(90deg)';
    return props.$right ? 'translateY(-50%) rotate(-90deg)' : 'translateY(-50%) rotate(90deg)';
  }};
  font-size: 18px;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: #FFFFFF;
  opacity: 1;
  z-index: 1000;
  cursor: pointer;
  white-space: nowrap;
  font-weight: 500;
  text-shadow: 0 0 5px rgba(255, 255, 255, 1);
  transition: transform 0.3s ease, font-size 0.3s ease;
  
  @media (max-width: 768px) {
    display: none; /* Sembunyikan di mobile */
  }

  &:hover {
    color: #FFFFFF;
    font-size: 22px;
    font-weight: 700;
    text-shadow: 0 0 15px rgba(255, 255, 255, 1), 0 0 10px rgba(255, 255, 255, 1), 0 0 5px rgba(255, 255, 255, 1);
    transform: ${props => {
      if (props.$center) return 'translate(-50%, -50%) rotate(90deg) scale(1.2)';
      return props.$right ? 
        'translateY(-50%) rotate(-90deg) scale(1.2)' : 
        'translateY(-50%) rotate(90deg) scale(1.2)';
    }};
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
  font-size: 1.25rem;
  line-height: 1.3;
  font-weight: 500;
  letter-spacing: 0.5px;
  padding: 1rem 8rem;
  max-height: 90vh;
  overflow-y: auto;
  margin: auto;
  text-align: center;

  h1 {
    font-size: 2.5rem;
    margin-bottom: 2rem;
    font-weight: 700;
    text-align: center;
  }

  .image-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
    margin: 2rem 0;

    &.single-image {
      grid-template-columns: 1fr;
      max-width: 500px;
      margin-left: auto;
      margin-right: auto;
      
      .image-container {
        height: 300px;
      }
    }
    
    .image-container {
      position: relative;
      height: 180px;
      border-radius: 12px;
      overflow: hidden;
      transition: transform 0.3s ease;

      &:hover {
        transform: scale(1.05);
      }
    }
  }

  .project-info {
    text-align: center;
    margin-top: 2rem;

    .tagline {
      font-size: 1.5rem;
      font-style: italic;
      opacity: 0.8;
      margin-bottom: 1rem;
    }

    .produced-text {
      font-size: 1rem;
      font-style: italic;
      opacity: 0.7;
      margin-bottom: 1rem;
    }

    .meta-info {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      font-size: 1rem;
      opacity: 0.7;

      .category, .year {
        margin: 0;
        padding: 0;
      }
    }
  }

  /* Styling untuk scrollbar */
  &::-webkit-scrollbar {
    width: 8px;
    background-color: rgba(255, 255, 255, 0.05);
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 4px;
    
    &:hover {
      background-color: rgba(255, 255, 255, 0.3);
    }
  }

  &::-webkit-scrollbar-track {
    background-color: transparent;
  }

  @media (max-width: 1024px) {
    padding: 1.5rem;
    
    h1 {
      font-size: 2.8rem;
      margin-bottom: 1.5rem;
    }

    .image-grid {
      &.single-image {
        max-width: 400px;
        
        .image-container {
          height: 250px;
        }
      }
    }
  }

  @media (max-width: 768px) {
    padding: 1rem;
    
    h1 {
      font-size: 2rem;
      margin-bottom: 1rem;
    }

    .image-grid {
      grid-template-columns: 1fr;
      
      .image-container {
        height: auto;
        aspect-ratio: 16/9;
      }
      
      &.single-image {
        max-width: 100%;
        
        .image-container {
          height: auto;
          aspect-ratio: 16/9;
        }
      }
    }

    .project-info {
      .tagline {
        font-size: 1.2rem;
      }

      .meta-info {
        flex-direction: column;
        gap: 0.5rem;
      }
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
  gap: 2rem;
  margin: 2rem 0;
  text-align: center;

  .projects-container {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
    width: 100%;
  }

  .project-item {
    cursor: pointer;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    overflow: hidden;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-5px);
      background: rgba(255, 255, 255, 0.1);
    }

    img {
      width: 100%;
      height: 250px;
      object-fit: cover;
      border-radius: 12px 12px 0 0;
    }

    .content {
      padding: 1.5rem;
      text-align: center;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    p {
      margin: 0;
      font-size: 1rem;
      line-height: 1.6;
      opacity: 0.8;
    }

    p:first-child {
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  }

  @media (max-width: 1024px) {
    .projects-container {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 768px) {
    .projects-container {
      grid-template-columns: 1fr;
    }
  }
`;

const TextContent = styled.div`
  font-size: 1.25rem;
  line-height: 1.8;
  opacity: 0.7;
  margin-bottom: 2rem;

  p {
    margin: 2rem 0;
  }

  .content-block {
    margin-bottom: 2rem;
    font-size: 1.1rem;
    line-height: 1.8;
    opacity: 0.9;
    text-align: justify;
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

interface ProjectDetail {
  title: string;
  image: string;
  description: string;
  tagline?: React.ReactNode;
  year?: string;
  Text?: React.ReactNode;
  category?: string;
  images?: string[];
  keterangan?: string;
}

interface ModalContent {
  title: string;
  text: string | React.ReactNode;
  subtitle?: string;
  subtext?: string | React.ReactNode;
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

  const [projectDetail, setProjectDetail] = useState<ProjectDetail | null>(null);

  // Listen for custom events from the Header component
  useEffect(() => {
    const handleOpenSidebarModal = (event: CustomEvent) => {
      const { type } = event.detail;
      if (type === 'about') {
        handleModalOpen('about');
      } else if (type === 'work') {
        handleModalOpen('work');
      }
    };

    // Add event listener for custom event
    document.addEventListener('openSidebarModal', handleOpenSidebarModal as EventListener);
    
    // Handle direct hash navigation
    if (window.location.hash === '#about') {
      handleModalOpen('about');
      // Clear the hash after handling to avoid reopening on refresh
      window.history.replaceState(null, '', window.location.pathname);
    }
    
    // Cleanup
    return () => {
      document.removeEventListener('openSidebarModal', handleOpenSidebarModal as EventListener);
    };
  }, []);

  const handleProjectClick = (project: ProjectDetail) => {
    setProjectDetail(project);
  };

  const closeProjectDetail = () => {
    setProjectDetail(null);
  };

  const projects = [
    {
      title: "⁠Ballin Product Commercial",
      image: "/images/portfolio/Ballin.jpg",
      description: '"Ballin"',
      images: [
        "/images/portfolio/Ballin2.jpg",
        "/images/portfolio/Ballin.jpg",
        "/images/portfolio/Ballin4.jpg"
      ],
      tagline: "Elegance. Luxury. Allure.",
      Text: "Produced by Lapis Visuals",
      category: "Product Commercial",
      year: "2024",
      keterangan: "Product Commercial"
    },
    {
      title: "⁠Eternal Plus and Water for Color Run",
      image: "/images/portfolio/Eternal Plus4.jpg",
      description: '"⁠Eternal Plus and Water for Color Run"',
      images: [
        "/images/portfolio/Eternal Plus2.jpg",
        "/images/portfolio/Eternal Plus4.jpg",
        "/images/portfolio/Eternal Plus1.jpg"
      ],
      Text: "Produced by Lapis Visuals",
      year: "2024",
      category: "Event Coverage",
      keterangan: "Event Coverage."
    },
    {
      title: "Things You Can See (2024)",
      image: "/images/portfolio/Think you say .jpg",
      description: '“Things You Can See” (2024)',
      images: [
        "/images/portfolio/Things You2.jpg",
        "/images/portfolio/Things You1.jpg",
        "/images/portfolio/Think you say .jpg"
      ],
      tagline: "A romantic-comedy short film produced by Lapis Visuals for Adhi and Irene",
      Text: (
        <>
          Executive Producers: Adhi Pranata, Irene Pratiwi, Cheriana Resky<br/>
          Producer: Brandon Hetarie, Bobby Adrian<br/>
          Writer & Director: Martian Angjaya<br/>
          Director of Photography: Cheriana Resky<br/>
        </>
      ),
      year: "2024",
      keterangan: "Short Film."
    
    },
    {
      title: "Timeless Treasures - Remboelan (2024)",
      image: "/images/portfolio/rembulan.jpg",
      description: '“Timeless Treasures” (2024)',
      images: [
        "/images/portfolio/rembulan.jpg",
        "/images/portfolio/Remnbulann1.jpg",
        "/images/portfolio/Remnbulann3.jpg"
      ],
      tagline: (
        <>
          Perserving Indonesian Culinary Heritage with Remboelan<br/>
          Commercial for Remboelan Group<br/>
          Produced by Lapis Visuals<br/>
        </>
      ),
      year: "2024",
      keterangan: "Commercial."
    },
    {
      title: "Ramadhan with Eternal Plus",
      image: "/images/portfolio/Ramadan.jpg",
      description: '"Ramadhan with Eternal Plus"',
      images: [
        "/images/portfolio/Ramadan.jpg",
      ],
      tagline: "Produced by Lapis Visuals",
      Text: "Commercial",
      year: "2025",
      keterangan: "Commercial."
    }
  ];

  const handleModalOpen = (type: 'work' | 'values' | 'about') => {
    const baseAddress = 'Jl. Digital Creative No.123\nJakarta Selatan, Indonesia 12345\ninfo@lapisstudio.com\n+62 21 1234 5678';
    
    if (type === 'about') {
      setModalContent({
        title: 'About Us',
        text: (
          <TextContent>
            <div className="content-block">
              Lapis Visuals is a Jakarta-based production company founded in 2024, driven by a passion for storytelling and a deep respect for the filmmaking process. Our roots trace back to Burbank, California—the epicenter of Hollywood and the heartbeat of the film industry—where we studied film and developed a strong foundation in cinematic storytelling.
            </div>

            <div className="content-block">
              With a team that holds extensive on-set experience across documentaries, short films, feature films, music videos, and commercials, we bring both versatility and depth to every project we take on.
            </div>

            <div className="content-block">
              What sets Lapis Visuals apart is our core belief that storytelling should always lead the creative process. While we value striking visuals, every frame is crafted to serve the narrative. For us, aesthetics are powerful tools to elevate the emotion, meaning, and message behind each story.
            </div>

            <div className="content-block">
              At Lapis Visuals, we don't just produce content—we tell stories that connect, inspire, and endure.
            </div>
          </TextContent>
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
            <div className="projects-container">
              {projects.map((project, index) => (
                <div 
                  key={index} 
                  className="project-item" 
                  onClick={() => handleProjectClick(project)}
                >
                  <img src={project.image} alt={`${project.title} Preview`} />
                  <div className="content">
                    <p>{project.description}</p>
                    <p style={{ 
                      fontStyle: 'italic', 
                      marginTop: '8px', 
                      fontSize: '0.85em',
                      opacity: 0.7,
                      textAlign: 'center'
                    }}>
                      {project.keterangan || 'Produksi Visual'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
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
      <VerticalText $offset={0} onClick={() => handleModalOpen('work')}>
        Our Works
      </VerticalText>
      <VerticalText $right $offset={0} onClick={() => handleModalOpen('about')}>
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

        {projectDetail && (
          <ModalOverlay
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={closeProjectDetail}
          >
            <CloseButton
              variants={buttonVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              whileHover="hover"
              onClick={closeProjectDetail}
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
              <motion.div variants={textVariants} custom={0}>
                <motion.h1>{projectDetail.title}</motion.h1>

                <div className={`image-grid ${projectDetail.images?.length === 1 ? 'single-image' : ''}`}>
                  {(projectDetail.images || [projectDetail.image]).map((img, index) => (
                    <div key={index} className="image-container">
                      <Image
                        src={img}
                        alt={`${projectDetail.title} View ${index + 1}`}
                        fill
                        style={{
                          objectFit: 'contain',
                        }}
                      />
                    </div>
                  ))}
                </div>

                <div className="project-info">
                  {projectDetail.tagline && (
                    <motion.p className="tagline">
                      {projectDetail.tagline}
                    </motion.p>
                  )}
                  {projectDetail.Text && (
                    <motion.p className="produced-text">
                      {projectDetail.Text}
                    </motion.p>
                  )}

                  <div className="meta-info">
                    {projectDetail.category && (
                      <motion.p className="category">
                        {projectDetail.category}
                      </motion.p>
                    )}
                    {projectDetail.year && (
                      <motion.p className="year"> 
                        {projectDetail.year}
                      </motion.p>
                    )}
                  </div>
                </div>
              </motion.div>
            </ModalText>
          </ModalOverlay>
        )}
      </AnimatePresence>
    </>
  );
}