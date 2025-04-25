'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const ServicesContainer = styled.div`
  padding: 8rem 8rem 4rem;
  max-width: 1400px;
  margin: 0 auto;
  color: var(--color-text);

  @media (max-width: 1024px) {
    padding: 7rem 4rem 3rem;
  }

  @media (max-width: 768px) {
    padding: 6rem 2rem 2rem;
  }
`;

const Title = styled.h1`
  font-size: 3.5rem;
  margin-bottom: 4rem;
  font-weight: 300;
  text-align: center;

  @media (max-width: 1024px) {
    font-size: 3.5rem;
    margin-bottom: 3rem;
  }

  @media (max-width: 768px) {
    font-size: 2.5rem;
    margin-bottom: 2rem;
  }
`;

const ServiceSection = styled.div`
  margin-bottom: 1rem;
`;

const ServiceTitle = styled.div`
  font-size: 1.5rem;
  padding: 1rem 0;
  font-weight: 300;
  opacity: 0.9;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  cursor: pointer;
  user-select: none;

  .title-content {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  &::before {
    content: "◆";
    font-size: 0.8rem;
    opacity: 0.7;
  }

  .arrow {
    font-size: 0.8rem;
    opacity: 0.7;
    transform-origin: center;
    transition: transform 0.3s ease;
    
    &.open {
      transform: rotate(180deg);
    }
  }
`;

const SubServiceList = styled(motion.div)`
  padding-left: 1.5rem;
  overflow: hidden;
`;

const SubServiceItem = styled.div`
  font-size: 1rem;
  margin-bottom: 0.5rem;
  opacity: 0.7;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &::before {
    content: "➜";
    font-size: 0.8rem;
    opacity: 0.7;
  }

  &:last-child {
    margin-bottom: 1rem;
  }
`;

const DownloadButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.2rem;
  color: var(--color-text);
  opacity: 0.9;
  text-decoration: none;
  margin-top: 4rem;
  
  &:hover {
    opacity: 1;
  }
`;

const servicesData = [
  {
    title: "Consultation and Development",
    items: [
      "Directing team",
      "Director's statement, pitch decks and look book",
      "Concept research and development",
      "Storyboarding",
      "Script refinement"
    ]
  },
  {
    title: "Pre-production",
    items: [
      "Talent acquisition",
      "Equipment sourcing",
      "Location scouting",
      "Scheduling and shoot logistical planning",
      "Budgeting"
    ]
  },
  {
    title: "Production",
    items: [
      "Directors",
      "Creative team support",
      "Producer team and production management",
      "Director of photography and crew",
      "Audio, light, and grip equipment"
    ]
  },
  {
    title: "Post-production",
    items: [
      "Editing",
      "Post-production scheduling and management",
      "Color grade, audio mix and sound design",
      "Royalty-free music sourcing and licensing original music score",
      "Conform and final delivery"
    ]
  }
];

export default function Services() {
  const [openSection, setOpenSection] = useState<number | null>(null);

  const toggleSection = (index: number) => {
    setOpenSection(openSection === index ? null : index);
  };

  return (
    <ServicesContainer>
      <Title>SERVICES</Title>

      {servicesData.map((section, index) => (
        <ServiceSection key={index}>
          <ServiceTitle onClick={() => toggleSection(index)}>
            <div className="title-content">
              {section.title}
            </div>
            <span className={`arrow ${openSection === index ? 'open' : ''}`}>▼</span>
          </ServiceTitle>
          <AnimatePresence>
            {openSection === index && (
              <SubServiceList
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              >
                {section.items.map((item, itemIndex) => (
                  <SubServiceItem key={itemIndex}>{item}</SubServiceItem>
                ))}
              </SubServiceList>
            )}
          </AnimatePresence>
        </ServiceSection>
      ))}
    </ServicesContainer>
  );
} 