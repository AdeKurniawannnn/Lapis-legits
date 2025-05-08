'use client';

import React, { useState, useMemo, useEffect } from 'react';
import styled from 'styled-components';
import Image from 'next/image';

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

const SectionTitle = styled.h2`
  font-size: var(--font-size-xlarge);
  margin-bottom: var(--spacing-lg);
  text-align: center;
  
  @media (max-width: 768px) {
    font-size: var(--font-size-large);
    margin-bottom: var(--spacing-md);
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

const CarouselWrapper = styled.div`
  overflow: hidden;
  width: 100%;
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

// Data penghargaan - dipisahkan dari komponen utama untuk optimasi
const getAwardData = () => [
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
    title: "Rome Indie Film Festival",
    description: "Official Selection di Rome Indie Film Festival 2023.",
    image: "/images/portfolio/ROME_INDIE_1.PNG",
    link: "/awards/rome-indie"
  },
  {
    id: 7,
    title: "Asian Film Festival",
    description: "Special Mention untuk kontribusi dalam sinema Asia Tenggara.",
    image: "/images/portfolio/OFFICIAL-SELECTION-Aasha-international-film-festival-2023.PNG",
    link: "/awards/asian-film-festival"
  },
  {
    id: 8,
    title: "Asian Film Festival",
    description: "Special Mention untuk kontribusi dalam sinema Asia Tenggara.",
    image: "/images/portfolio/BEST SHORT FILM DIRECTOR - Asian Film Festival Los Angeles Hollywood - 2023 (1).png",
    link: "/awards/asian-film-festival"
  },
  {
    id: 9,
    title: "Asian Film Festival",
    description: "Special Mention untuk kontribusi dalam sinema Asia Tenggara.",
    image: "/images/portfolio/OFFICIAL-SELECTION-South-Italy-International-Film-Festival-2023.PNG",
    link: "/awards/asian-film-festival"
  },
  {
    id: 10,
    title: "Asian Film Festival",
    description: "Special Mention untuk kontribusi dalam sinema Asia Tenggara.",
    image: "/images/portfolio/page-5-1.PNG",
    link: "/awards/asian-film-festival"
  },
  {
    id: 11,
    title: "Asian Film Festival",
    description: "Special Mention untuk kontribusi dalam sinema Asia Tenggara.",
    image: "/images/portfolio/output-onlinepngtools (4).png",
    link: "/awards/asian-film-festival"
  },
  {
    id: 12,
    title: "Asian Film Festival",
    description: "Special Mention untuk kontribusi dalam sinema Asia Tenggara.",
    image: "/images/portfolio/winner2.PNG",
    link: "/awards/asian-film-festival"
  },
  {
    id: 13,
    title: "Asian Film Festival",
    description: "Special Mention untuk kontribusi dalam sinema Asia Tenggara.",
    image: "/images/portfolio/output-onlinepngtools.png",
    link: "/awards/asian-film-festival"
  },
  {
    id: 14,
    title: "Asian Film Festival",
    description: "Special Mention untuk kontribusi dalam sinema Asia Tenggara.",
    image: "/images/portfolio/output-onlinepngtools (3).png",
    link: "/awards/asian-film-festival"
  },
  {
    id: 15,
    title: "Asian Film Festival",
    description: "Special Mention untuk kontribusi dalam sinema Asia Tenggara.",
    image: "/images/portfolio/output-onlinepngtools (2).png",
    link: "/awards/asian-film-festival"
  },
  {
    id: 16,
    title: "Asian Film Festival",
    description: "Special Mention untuk kontribusi dalam sinema Asia Tenggara.",
    image: "/images/portfolio/output-onlinepngtools (1).png",
    link: "/awards/asian-film-festival"
  },
  {
    id: 17,
    title: "Asian Film Festival",
    description: "Special Mention untuk kontribusi dalam sinema Asia Tenggara.",
    image: "/images/portfolio/ISA_HM_Jul23_-_Golden.png",
    link: "/awards/asian-film-festival"
  },
  {
    id: 18,
    title: "Asian Film Festival",
    description: "Special Mention untuk kontribusi dalam sinema Asia Tenggara.",
    image: "/images/portfolio/official_selection.png",
    link: "/awards/asian-film-festival"
  },
  {
    id: 19,
    title: "Asian Film Festival",
    description: "Special Mention untuk kontribusi dalam sinema Asia Tenggara.",
    image: "/images/portfolio/OFFICIALSELECTION-UnitedKingdomMusicVideoFestival-2023-1-1-scaled.PNG",
    link: "/awards/asian-film-festival"
  },
  {
    id: 20,
    title: "Asian Film Festival",
    description: "Special Mention untuk kontribusi dalam sinema Asia Tenggara.",
    image: "/images/portfolio/1.png",
    link: "/awards/asian-film-festival"
  }
];
const AwardsSection: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [cards, setCards] = useState<any[]>([]);
  
  // Load awards data menggunakan useEffect untuk client-side rendering
  useEffect(() => {
    setCards(getAwardData());
  }, []);
  
  // Mengelompokkan kartu per slide dengan cardsPerSlide yang adaptif
  const groupedCards = useMemo(() => {
    if (!cards.length) return [];
    
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
  
  // Jika data belum ada, tampilkan skeleton loader
  if (!cards.length) {
    return (
      <CardSection>
        <SectionTitle>AWARDS & ACCOMPLISHMENTS</SectionTitle>
        <CarouselContainer>
          <div style={{ textAlign: 'center', padding: '3rem 0' }}>Loading awards...</div>
        </CarouselContainer>
      </CardSection>
    );
  }
  
  return (
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
                        <Image 
                          src={card.image} 
                          alt={card.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          style={{ objectFit: 'cover' }}
                          loading="lazy"
                          onError={(e) => {
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
        
        {totalSlides > 1 && (
          <>
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
          </>
        )}
      </CarouselContainer>
    </CardSection>
  );
};

export default AwardsSection; 