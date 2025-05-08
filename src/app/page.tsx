'use client';

import React, { useEffect, useState, useRef, useMemo } from 'react';
import styled from 'styled-components';
import { motion, useScroll, useTransform } from 'framer-motion';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import Footer from '@/components/layout/Footer';
import ServicesSection from '@/components/services/ServicesSection';
import Link from 'next/link';
import Image from 'next/image';
import SnapScrollContainer from '@/components/video/SnapScrollContainer';
import LazyVideoSection from '@/components/video/LazyVideoSection';
import { IntersectionDebugger } from '@/components/debug';
import { isDebugModeEnabled, getDebugToggleUrl, debugLog, debugFeatures } from '@/utils/debugUtils';
import { VIDEO_CONSTANTS } from '@/components/video/LazyVideoSection';
import { videoSections } from '@/config/videoSections';
import SnapScrollVideoSection from '@/components/video/SnapScrollVideoSection';

const Main = styled.main`
  width: 100%;
  min-height: 100vh;
  background-color: var(--color-background);
  color: var(--color-text);
`;

const Section = styled.section`
  padding: var(--spacing-xl) 0;
  position: relative;
  
  @media (max-width: 768px) {
    padding: var(--spacing-lg) 0;
  }
  
  @media (max-width: 480px) {
    padding: var(--spacing-md) 0;
  }
`;

const SectionTitle = styled.h2`
  font-size: var(--font-size-xlarge);
  margin-bottom: var(--spacing-lg);
  text-align: center;
  
  @media (max-width: 768px) {
    font-size: var(--font-size-large);
    margin-bottom: var(--spacing-md);
  }
`;

const ContentSection = styled.section`
  padding: var(--spacing-xl) 0;
  position: relative;
  background-color: var(--color-background-dark);
  color: var(--color-text-light);
  margin-top: 0; /* Remove the margin that was needed for video scroll sections */
  opacity: 0; /* Start hidden */
  animation: fadeIn 1s ease-in-out forwards;
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  @media (max-width: 768px) {
    padding: var(--spacing-lg) 0;
  }
  
  @media (max-width: 480px) {
    padding: var(--spacing-md) 0;
  }
`;

const DevLinks = styled.div`
  padding: 1rem;
  background-color: rgba(248, 249, 250, 0.8);
  text-align: center;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 100;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  
  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }
`;

const DevLink = styled(Link)`
  color: #007bff;
  text-decoration: underline;
  margin-right: 1rem;
  
  @media (max-width: 768px) {
    margin-right: 0;
  }
  
  &:last-child {
    margin-right: 0;
  }
`;

const ResponsiveContainer = styled.div`
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 var(--spacing-lg);
  
  @media (max-width: 768px) {
    padding: 0 var(--spacing-md);
  }
  
  @media (max-width: 480px) {
    padding: 0 var(--spacing-sm);
  }
`;

const PageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background-color: #000;
  color: white;
`;

const CurrentSectionHeading = styled.div`
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 1.5rem;
  font-weight: bold;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 0.5rem 1.5rem;
  border-radius: 30px;
  z-index: 100;
  transition: opacity 0.3s ease, transform 0.3s ease;
  
  @media (max-width: 768px) {
    font-size: 1rem;
    padding: 0.4rem 1rem;
  }
`;

// Animated scroll indicator with bounce effect
const ScrollIndicator = styled.div`
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  color: white;
  font-size: 0.9rem;
  z-index: 100;
  
  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% {
      transform: translateY(0);
    }
    40% {
      transform: translateY(-10px);
    }
    60% {
      transform: translateY(-5px);
    }
  }
  
  svg {
    margin-top: 8px;
    animation: bounce 2s infinite;
  }
`;

const PageWrapper = styled.div`
  position: relative;
  width: 100%;
  min-height: 100vh;
  background: #000;
`;

// Komponen kartu untuk section di bawah video
const CardSection = styled.section`
  padding: var(--spacing-xl) 0;
  background-color: var(--color-background);
  position: relative;
  overflow: visible;
  
  @media (max-width: 768px) {
    padding: var(--spacing-lg) 0;
  }
  
  @media (max-width: 480px) {
    padding: var(--spacing-md) 0;
  }
`;

const CarouselContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 60px;
  position: relative;
  
  @media (max-width: 768px) {
    padding: 0 50px;
  }
  
  @media (max-width: 480px) {
    padding: 0 40px;
  }
`;

const CarouselTrack = styled.div<{currentSlide: number}>`
  display: flex;
  transition: transform 0.5s ease;
  width: 100%;
  transform: translateX(-${props => props.currentSlide * 100}%);
`;

const CarouselSlide = styled.div`
  min-width: 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const CarouselCardWrapper = styled.div`
  padding: 10px;
`;

const CarouselButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: var(--color-primary);
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: var(--color-primary-dark);
  }
  
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
  
  svg {
    width: 24px;
    height: 24px;
  }
`;

const PrevButton = styled(CarouselButton)`
  left: 5px;
  
  @media (max-width: 768px) {
    left: 5px;
    width: 40px;
    height: 40px;
  }
`;

const NextButton = styled(CarouselButton)`
  right: 5px;
  
  @media (max-width: 768px) {
    right: 5px;
    width: 40px;
    height: 40px;
  }
`;

const CarouselWrapper = styled.div`
  overflow: hidden;
  width: 100%;
`;

const CardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--spacing-lg);
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 var(--spacing-lg);
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: var(--spacing-md);
    padding: 0 var(--spacing-md);
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    padding: 0 var(--spacing-sm);
  }
`;

const Card = styled.div`
  background-color: var(--color-background-light);
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  height: 100%;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  }
`;

const CardImage = styled.div`
  width: 100%;
  height: 240px;
  background-color: #333;
  position: relative;
  overflow: hidden;
`;

const CardContent = styled.div`
  padding: var(--spacing-md);
`;

const CardTitle = styled.h3`
  font-size: var(--font-size-medium);
  margin-bottom: var(--spacing-sm);
`;

const CardDescription = styled.p`
  font-size: var(--font-size-small);
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-sm);
`;

const CardButton = styled.a`
  display: inline-block;
  padding: 8px 16px;
  background-color: var(--color-primary);
  color: white;
  border-radius: 4px;
  text-decoration: none;
  font-size: var(--font-size-small);
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: var(--color-primary-dark);
  }
`;

export default function Home() {
  const mainRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [currentSectionTitle, setCurrentSectionTitle] = useState('');
  const [sectionVisibility, setSectionVisibility] = useState<number[]>(new Array(videoSections.length).fill(0));
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  const [debugMode, setDebugMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Tambahkan array kartu untuk carousel dengan data penghargaan yang lebih relevan
  const cards = [
    {
      id: 1,
      title: "Paris Film Festival",
      description: "Official Selection 2022 di Paris International Film Festival untuk dokumenter terbaik.",
      image: "/images/portfolio/Paris Official Selection Laurel 2022 (W).png",
      link: "/awards/paris-film-festival"
    },
    {
      id: 2,
      title: "Jakarta Film Awards",
      description: "Pemenang kategori Best Cinematography di Jakarta Film Awards 2023.",
      image: "/images/portfolio/LA OFFICIAL SELECTION (W) (1).png",
      link: "/awards/jakarta-film-awards"
    },
    {
      id: 3,
      title: "Piala Maya",
      description: "Nominasi untuk Film Dokumenter Terbaik di Piala Maya 2022.",
      image: "/images/portfolio/Berlin Online Selection Laurel 2022 (W) .png",
      link: "/awards/piala-maya"
    },
    {
      id: 4,
      title: "Festival Film Bandung",
      description: "Penghargaan Khusus Juri untuk inovasi visual storytelling.",
      image: "/images/portfolio/LA Official Selection (W).png",
      link: "/awards/ffb"
    },
    {
      id: 5,
      title: "Citra Awards",
      description: "Nominasi untuk kategori Sutradara Terbaik dalam Film Pendek.",
      image: "/images/portfolio/New York Laurels 2024 (W) (1).png",
      link: "/awards/citra"
    },
    {
      id: 6,
      title: "Asian Film Festival",
      description: "Special Mention untuk kontribusi dalam sinema Asia Tenggara.",
      image: "/images/portfolio/award6.jpg",
      link: "/awards/asian-film-festival"
    }
  ];
  
  // Restrukturisasi objek cards menjadi array grup untuk carousel
  const groupedCards = useMemo(() => {
    const result = [];
    const cardsPerSlide = window?.innerWidth <= 480 ? 1 : window?.innerWidth <= 1024 ? 2 : 3;
    
    for (let i = 0; i < cards.length; i += cardsPerSlide) {
      result.push(cards.slice(i, i + cardsPerSlide));
    }
    
    return result;
  }, [cards]);
  
  const totalSlides = groupedCards.length;
  
  const handlePrevSlide = () => {
    setCurrentSlide(prev => (prev > 0 ? prev - 1 : 0));
  };
  
  const handleNextSlide = () => {
    setCurrentSlide(prev => (prev < totalSlides - 1 ? prev + 1 : prev));
  };
  
  useEffect(() => {
    debugLog('Home component mounted, video sections:', videoSections);
    
    // Ensure IntersectionObserver polyfill is loaded
    if (!('IntersectionObserver' in window)) {
      import('intersection-observer');
    }
    
    // Add keyboard shortcut handler for debug mode
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === 'd') {
        event.preventDefault();
        setDebugMode(prev => !prev);
        // Update URL to reflect debug mode change
        const newUrl = getDebugToggleUrl(!debugMode);
        window.history.pushState({}, '', newUrl);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    
    // Debounce scroll events for better performance
    let timeout: NodeJS.Timeout;
    
    const handleScroll = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setScrollY(window.scrollY);
      }, 10);
    };
    
    const checkDevice = () => {
      setIsMobile(window.innerWidth <= 768);
      setIsTablet(window.innerWidth <= 1024 && window.innerWidth > 768);
    };
    
    // Check for debug mode
    setDebugMode(isDebugModeEnabled());
    
    // Initial check
    checkDevice();
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', checkDevice);
    window.addEventListener('orientationchange', checkDevice);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', checkDevice);
      window.removeEventListener('orientationchange', checkDevice);
      window.removeEventListener('keydown', handleKeyPress);
      clearTimeout(timeout);
    };
  }, [debugMode]);
  
  // Listen for URL changes to update debug mode
  useEffect(() => {
    const handleRouteChange = () => {
      setDebugMode(isDebugModeEnabled());
    };
    
    window.addEventListener('popstate', handleRouteChange);
    
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);
  
  // Update current section heading when the active section changes
  useEffect(() => {
    // Update heading text
    setCurrentSectionTitle(videoSections[activeIndex]?.title || '');
    
    // Hide the scroll indicator after the first change
    if (activeIndex > 0) {
      setShowScrollIndicator(false);
    }
    
    // Show scroll indicator again when reaching the last section, with different text
    if (activeIndex === videoSections.length - 1) {
      setTimeout(() => {
        setShowScrollIndicator(true);
      }, 1000);
    }
  }, [activeIndex]);
  
  // Handle section change
  const handleSectionChange = (index: number) => {
    setActiveIndex(index);
    
    // Update section visibility for debugging (normally this would come from SnapScrollContainer)
    const newVisibility = Array(videoSections.length).fill(0);
    newVisibility[index] = 1; // Set current section to 100% visible
    setSectionVisibility(newVisibility);
  };
  
  const handleHeroScroll = () => {
    if (activeIndex === videoSections.length - 1) {
      // Navigate to the our-work page instead of scrolling to a section
      window.location.href = '/our-work';
    } else {
      // If not on the last section, scroll to the next section
      const nextIndex = activeIndex + 1;
      if (nextIndex < videoSections.length) {
        setActiveIndex(nextIndex);
        
        // Update section visibility for debugging
        const newVisibility = Array(videoSections.length).fill(0);
        newVisibility[nextIndex] = 1; 
        setSectionVisibility(newVisibility);
      }
    }
  };

  const handleModalStateChange = (modalOpen: boolean) => {
    setIsModalOpen(modalOpen);
  };

  return (
    <PageWrapper>
      <Sidebar isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
      <Main>
        <Header />
        <PageContainer ref={mainRef}>
          {/* Development links - only visible in debug mode */}
          {debugMode && (
            <DevLinks>
              <DevLink href="/scroll-test">
                View Scroll Video Hook Test Page
              </DevLink>
              <DevLink href="/video-player-test">
                View Video Player Test Page
              </DevLink>
              <DevLink href="/scroll-video-sections">
                View Scroll Video Sections Test Page
              </DevLink>
              <DevLink href="/snap-scroll-example">
                View Snap Scroll Example Page
              </DevLink>
              <DevLink href={getDebugToggleUrl(debugMode)}>
                {debugMode ? 'Disable Debug Mode' : 'Enable Debug Mode'}
              </DevLink>
              <DevLink href={`/?debug=true&debugFeatures=${debugFeatures.INTERSECTION_OBSERVER}`}>
                Enhanced Intersection Debug
              </DevLink>
            </DevLinks>
          )}
          
          {/* Current section title - only shown in debug mode */}
          {debugMode && (
            <CurrentSectionHeading>
              {currentSectionTitle}
            </CurrentSectionHeading>
          )}
          
          {/* Scroll indicator (only shown at beginning and end) */}
          {showScrollIndicator && !isModalOpen && (
            <ScrollIndicator onClick={handleHeroScroll}>
              {activeIndex === videoSections.length - 1 ? 'Scroll to content' : 'Scroll to explore'}
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 17L12 7" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                <path d="M7 12L12 17L17 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </ScrollIndicator>
          )}
          
          <SnapScrollVideoSection
            sections={videoSections}
            activeIndex={activeIndex}
            onSectionChange={handleSectionChange}
            hideText={isModalOpen}
            isInView={true}
          />
          
          {/* Debug visualization for development - only shown in debug mode */}
          {debugMode && (
            <IntersectionDebugger 
              visibility={sectionVisibility}
              activeIndex={activeIndex}
              totalSections={videoSections.length}
            />
          )}
        </PageContainer>
        
        {/* Section kartu di bawah video */}
        <CardSection>
          <SectionTitle>AWARDS & ACCOMPLISHMENTS</SectionTitle>
          <CarouselContainer>
            <CarouselWrapper>
              <CarouselTrack currentSlide={currentSlide}>
                {groupedCards.map((cardGroup, slideIndex) => (
                  <CarouselSlide key={`slide-${slideIndex}`}>
                    {cardGroup.map(card => (
                      <CarouselCardWrapper key={card.id}>
                        <Card>
                          <CardImage>
                            {/* Gunakan komponen Image dari Next.js dengan fallback */}
                            <Image 
                              src={card.image} 
                              alt={card.title}
                              fill
                              style={{ objectFit: 'cover' }}
                              onError={(e) => {
                                // Fallback jika gambar gagal dimuat
                                const target = e.target as HTMLImageElement;
                                target.src = '/images/placeholder.jpg';
                              }}
                            />
                          </CardImage>
                          <CardContent>
                            <CardTitle>{card.title}</CardTitle>
                            <CardDescription>{card.description}</CardDescription>
                            <CardButton href={card.link}>Selengkapnya</CardButton>
                          </CardContent>
                        </Card>
                      </CarouselCardWrapper>
                    ))}
                  </CarouselSlide>
                ))}
              </CarouselTrack>
            </CarouselWrapper>
            <PrevButton onClick={handlePrevSlide} disabled={currentSlide === 0}>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 19L8 12L15 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </PrevButton>
            <NextButton onClick={handleNextSlide} disabled={currentSlide === totalSlides - 1}>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 5L16 12L9 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </NextButton>
          </CarouselContainer>
        </CardSection>
        
        <Footer />
      </Main>
    </PageWrapper>
  );
}
