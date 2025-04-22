'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

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
  font-size: 4.5rem;
  margin-bottom: 3rem;
  font-weight: 500;

  @media (max-width: 1024px) {
    font-size: 3.5rem;
    margin-bottom: 2.5rem;
  }

  @media (max-width: 768px) {
    font-size: 2.5rem;
    margin-bottom: 2rem;
  }
`;

const Description = styled.p`
  font-size: 1.2rem;
  line-height: 1.8;
  margin-bottom: 6rem;
  opacity: 0.7;
  max-width: 900px;

  @media (max-width: 1024px) {
    font-size: 1.1rem;
    line-height: 1.7;
    margin-bottom: 5rem;
  }

  @media (max-width: 768px) {
    font-size: 1rem;
    line-height: 1.6;
    margin-bottom: 4rem;
  }
`;

const CreativeSection = styled.div`
  margin-bottom: 6rem;

  @media (max-width: 1024px) {
    margin-bottom: 5rem;
  }

  @media (max-width: 768px) {
    margin-bottom: 4rem;
  }
`;

const CreativeTitle = styled.h2`
  font-size: 2.5rem;
  margin-bottom: 2rem;
  font-weight: 400;

  @media (max-width: 1024px) {
    font-size: 2rem;
    margin-bottom: 1.5rem;
  }

  @media (max-width: 768px) {
    font-size: 1.8rem;
    margin-bottom: 1.2rem;
  }
`;

const ServiceList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const ServiceItem = styled.li`
  margin-bottom: 1rem;
  opacity: 0.7;
  font-size: 1.1rem;
  
  &::before {
    content: "- ";
  }

  @media (max-width: 768px) {
    font-size: 1rem;
    margin-bottom: 0.8rem;
  }
`;

const AccordionSection = styled.div`
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const AccordionHeader = styled.div<{ $isActive?: boolean }>`
  padding: 1.5rem 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  
  h3 {
    font-size: 2rem;
    font-weight: 400;
    opacity: ${props => props.$isActive ? 1 : 0.7};

    @media (max-width: 1024px) {
      font-size: 1.8rem;
    }

    @media (max-width: 768px) {
      font-size: 1.5rem;
    }
  }

  span {
    transform: ${props => props.$isActive ? 'rotate(180deg)' : 'rotate(0)'};
    transition: transform 0.3s ease;
    opacity: 0.7;
    font-size: 1rem;

    @media (max-width: 768px) {
      font-size: 0.8rem;
    }
  }

  @media (max-width: 1024px) {
    padding: 1.2rem 0;
  }

  @media (max-width: 768px) {
    padding: 1rem 0;
  }
`;

const AccordionContent = styled(motion.div)`
  padding: 0;
  overflow: hidden;
`;

const AccordionInner = styled.div`
  padding: 0 0 2rem;
  
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  li {
    margin-bottom: 0.8rem;
    opacity: 0.7;
    font-size: 1.1rem;
    
    &::before {
      content: "- ";
    }

    @media (max-width: 768px) {
      font-size: 1rem;
      margin-bottom: 0.6rem;
    }
  }

  @media (max-width: 1024px) {
    padding: 0 0 1.5rem;
  }

  @media (max-width: 768px) {
    padding: 0 0 1rem;
  }
`;

export default function Services() {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    if (activeSection === section) {
      setActiveSection(null);
    } else {
      setActiveSection(section);
    }
  };

  const accordionData = {
    'pre-pro': [
      'location scouting',
      'casting',
      'equipment planning',
      'scheduling',
      'budget management'
    ],
    'production': [
      'cinematography',
      'lighting design',
      'sound recording',
      'art direction',
      'on-set coordination'
    ],
    'post': [
      'editing',
      'color grading',
      'sound design',
      'visual effects',
      'final delivery'
    ],
    'specialty': [
      'aerial cinematography',
      'underwater filming',
      'time-lapse photography',
      'motion control',
      'virtual production'
    ]
  };

  return (
    <ServicesContainer>
      <Title>SERVICES</Title>
      
      <Description>
        We know every project is unique, so we approach each one with fresh ideas and a tailored plan. 
        Our team works closely with you through every step—from concept development and script refinement 
        to production and final delivery. We dig into the details, research, and everything in between 
        to make sure your project stands out and gets the results you need.
      </Description>

      <CreativeSection>
        <CreativeTitle>creative</CreativeTitle>
        <ServiceList>
          <ServiceItem>director team</ServiceItem>
          <ServiceItem>concept development and collaboration</ServiceItem>
          <ServiceItem>director treatment and pitch decks</ServiceItem>
          <ServiceItem>script refinement</ServiceItem>
          <ServiceItem>research and storyboarding</ServiceItem>
        </ServiceList>
      </CreativeSection>

      {Object.entries(accordionData).map(([section, items]) => (
        <AccordionSection key={section}>
          <AccordionHeader 
            $isActive={activeSection === section}
            onClick={() => toggleSection(section)}
          >
            <h3>{section}</h3>
            <span>▼</span>
          </AccordionHeader>
          <AccordionContent
            initial={false}
            animate={{ 
              height: activeSection === section ? 'auto' : 0,
              opacity: activeSection === section ? 1 : 0
            }}
            transition={{ duration: 0.3 }}
          >
            <AccordionInner>
              <ul>
                {items.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </AccordionInner>
          </AccordionContent>
        </AccordionSection>
      ))}
    </ServicesContainer>
  );
} 