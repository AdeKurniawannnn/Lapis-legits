'use client';

import React, { useEffect, useState, useRef, useMemo } from 'react';
import styled from 'styled-components';
import { motion, useScroll, useTransform } from 'framer-motion';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
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
import dynamic from 'next/dynamic';

const LazyFooter = dynamic(() => import('@/components/layout/Footer'), {
  loading: () => <div>Loading footer...</div>,
  ssr: true
});

const AwardsSection = dynamic(() => import('@/components/awards/AwardsSection'), {
  loading: () => <div className="loading-awards">Loading awards...</div>,
  ssr: false
});

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
        
        {/* Gunakan dynamic import untuk Awards section */}
        <AwardsSection />
        
        {/* Gunakan dynamic import untuk Footer */}
        <LazyFooter />
      </Main>
    </PageWrapper>
  );
}
