'use client';

import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import Image from 'next/image';
import { FaInstagram, FaYoutube, FaLinkedinIn, FaFacebookF } from 'react-icons/fa';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

const FooterContainer = styled.footer`
  background-color: #000000;
  padding: var(--spacing-xl) 0;
  color: #ffffff;
`;

const FooterContent = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: var(--spacing-xl);
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 var(--spacing-lg);
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FooterColumn = styled.div`
  display: flex;
  flex-direction: column;
`;

const FooterLogo = styled.div`
  margin-bottom: var(--spacing-md);
  position: relative;
  width: 120px;
  height: 40px;
`;

const FooterText = styled.p`
  color: #808080;
  margin-bottom: var(--spacing-md);
  font-size: 16px;
  line-height: 1.6;
  max-width: 500px;
`;

const FooterHeading = styled.h3`
  font-size: 24px;
  font-weight: 400;
  margin-bottom: var(--spacing-lg);
  color: #ffffff;
`;

const FooterLinks = styled.ul`
  list-style: none;
  padding: 0;
`;

const FooterLink = styled.li`
  margin-bottom: var(--spacing-md);
  a {
    color: #808080;
    text-decoration: none;
    font-size: 16px;
    transition: color 0.2s ease;
    &:hover {
      color: #ffffff;
    }
  }
`;

const FooterBottom = styled.div`
  max-width: 1440px;
  margin: var(--spacing-xl) auto 0;
  padding: var(--spacing-lg) var(--spacing-lg) 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  @media (max-width: 768px) {
    flex-direction: column;
    gap: var(--spacing-md);
  }
`;

const Copyright = styled.p`
  color: #808080;
  font-size: 14px;
`;

const SocialLinks = styled.div`
  display: flex;
  gap: var(--spacing-lg);
  align-items: center;
`;

const SocialLink = styled.a`
  color: #808080;
  text-decoration: none;
  font-size: 20px;
  transition: color 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: 1px solid #808080;
  border-radius: 50%;
  &:hover {
    color: #ffffff;
    border-color: #ffffff;
  }
`;

const ContactInfo = styled(FooterText)`
  margin-bottom: 8px;
  line-height: 1.8;
`;

export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <FooterContainer>
      <FooterContent>
        <FooterColumn>
          <FooterHeading>Lapis Visuals</FooterHeading>
          <FooterText>
            A production company based in Jakarta, Indonesia a passion for layered storytelling and purposeful visuals. From short films to branded content, we craft every frame with intention.
          </FooterText>
          <FooterText>
            Layered Stories. Crafted Visuals.
          </FooterText>
        </FooterColumn>
        <FooterColumn>
          <FooterHeading>Services</FooterHeading>
          <FooterLinks>
            <FooterLink><Link href="/services/commercial">Commercial Production</Link></FooterLink>
            <FooterLink><Link href="/services/documentary">Documentary</Link></FooterLink>
            <FooterLink><Link href="/services/corporate">Corporate Videos</Link></FooterLink>
            <FooterLink><Link href="/services/events">Narrative</Link></FooterLink>
            <FooterLink><Link href="/services/events">Event Coverage</Link></FooterLink>
            <FooterLink><Link href="/services/events">Social Media Content</Link></FooterLink>
          </FooterLinks>
        </FooterColumn>
        <FooterColumn>
          <FooterHeading></FooterHeading>
          <ContactInfo><br />
            Email : lapisvisualsinfo@gmail.com<br />
          </ContactInfo>
          <SocialLinks>
            <SocialLink href="https://www.instagram.com/lapisvisuals?igsh=MTl3ZG0zMHZxcjRwZg==" target="_blank" aria-label="Instagram">
              <FaInstagram />
            </SocialLink>
            <SocialLink href="https://youtube.com/@lapisvisuals?si=V6pEuocjbIFRZXwy" target="_blank" aria-label="YouTube">
              <FaYoutube />
            </SocialLink>
            <SocialLink href="https://www.linkedin.com/company/lapis-visuals" target="_blank" aria-label="LinkedIn">
              <FaLinkedinIn />
            </SocialLink>
            <SocialLink href="https://www.facebook.com/share/1YoZ8JGYRk/" target="_blank" aria-label="Facebook">
              <FaFacebookF />
            </SocialLink>
          </SocialLinks>
        </FooterColumn>
      </FooterContent>
      <FooterBottom>
        <Copyright>© {currentYear} LAPIS. All rights reserved.</Copyright>
      </FooterBottom>
    </FooterContainer>
  );
}
