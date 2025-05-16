'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Footer from '@/components/layout/Footer';
import Sidebar from '@/components/layout/Sidebar';

const ServicesContainer = styled.div`
  padding: 8rem 2rem 4rem;
  max-width: 1200px;
  margin: 0 auto;
  color: var(--color-text);
  text-align: left;

  @media (max-width: 1024px) {
    padding: 7rem 2rem 3rem;
  }

  @media (max-width: 768px) {
    padding: 6rem 1.5rem 2rem;
  }
`;

const Title = styled.h1`
  font-size: 3.5rem;
  margin-bottom: 4rem;
  font-weight: 400;
  color: #FFFFFF;
  text-align: center;

  @media (max-width: 1024px) {
    font-size: 3.5rem;
    margin-bottom: 3.5rem;
  }

  @media (max-width: 768px) {
    font-size: 2.8rem;
    margin-bottom: 2.5rem;
  }
`;

const ServiceSection = styled.div`
  margin-bottom: 6rem;
  max-width: 900px;
  margin: 0 auto 6rem;
`;

const ServiceTitle = styled.h2`
  font-size: 2.8rem;
  font-weight: 500;
  color: #FFFFFF;
  margin-bottom: 1rem;
  text-align: center;
`;

const ServiceSubtitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 400;
  color: #CCCCCC;
  font-style: italic;
  margin-bottom: 2rem;
  text-align: center;
`;

const ServiceDescription = styled.p`
  font-size: 1.1rem;
  line-height: 1.8;
  color: #999999;
  max-width: 900px;
  margin: 0 auto;
  text-align: left;
  padding: 0 1rem;
`;

const DownloadIcon = styled.div`
  margin-top: 3rem;
  text-align: center;
  
  svg {
    width: 40px;
    height: 40px;
    opacity: 0.7;
    cursor: pointer;
    transition: opacity 0.3s ease;
    
    &:hover {
      opacity: 1;
    }
  }
`;

const FooterSection = styled.div`
  margin-top: 4rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  color: #CCCCCC;
  font-size: 0.9rem;
  display: flex;
  justify-content: center;
  opacity: 0.7;
`;

export default function Services() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const servicesData = [
    {
      title: "Commercial",
      subtitle: "Purpose-driven storytelling built to sell.",
      description: "We craft visually compelling commercials that connect emotionally while promoting your product, service, or brand. Each piece is rooted in a strong narrative approach—designed to resonate with your audience and drive action across TV, digital, and social platforms."
    },
    {
      title: "Documentary",
      subtitle: "Real stories, authentically told.",
      description: "We specialize in documentary films that explore meaningful subjects with depth and empathy. From development to post-production, we focus on human-centered storytelling that reveals truth, builds connection, and leaves a lasting impression."
    },
    {
      title: "Corporate Videos",
      subtitle: "Professional content tailored to your business.",
      description: "Our corporate videos go beyond delivering information—they communicate your company's values and vision through story-led content. Whether it's internal communication, recruitment, or brand storytelling, we humanize your message with clarity and care."
    },
    {
      title: "Narrative",
      subtitle: "Cinematic storytelling with impact.",
      description: "This is where our passion for story takes the lead. We develop and produce scripted content—short films, branded fiction, and more—that reflect your creative vision with depth, character, and a strong cinematic voice."
    },
    {
      title: "Event Coverage",
      subtitle: "Every angle of your event, professionally captured.",
      description: "We provide professional multi-camera coverage of your events, capturing not just what happened, but the feeling of being there. From highlight reels to full-length edits, we aim to tell the story of your event with precision and flair."
    },
    {
      title: "Social Media Content",
      subtitle: "Snackable content made to go viral.",
      description: "We create engaging, platform-optimized videos for Instagram, TikTok, YouTube, and beyond. Every piece is crafted with storytelling in mind—fast, fun, and purposeful content that fits your audience and your brand's voice."
    }
  ];

  return (
    <>
      <Sidebar isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
      <ServicesContainer>
        <Title>SERVICES</Title>

        {servicesData.map((service, index) => (
          <ServiceSection key={index}>
            <ServiceTitle>
              {service.title}
            </ServiceTitle>
            <ServiceSubtitle>
              {service.subtitle}
            </ServiceSubtitle>
            <ServiceDescription>
              {service.description}
            </ServiceDescription>
          </ServiceSection>
        ))}
      </ServicesContainer>
      <Footer />
    </>
  );
} 