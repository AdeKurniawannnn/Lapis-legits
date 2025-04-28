'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Download } from 'lucide-react';

const HeaderContainer = styled.header<{ $scrolled: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: var(--z-index-menu);
  padding: ${props => props.$scrolled ? 'var(--spacing-sm)' : 'var(--spacing-md)'} 0;
  background-color: ${props => props.$scrolled ? 'rgba(10, 10, 10, 0.95)' : 'transparent'};
  backdrop-filter: ${props => props.$scrolled ? 'blur(8px)' : 'none'};
  transition: all var(--transition-medium);
`;

const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 var(--spacing-lg);
  
  @media (max-width: 768px) {
    padding: 0 var(--spacing-md);
  }
`;

const Logo = styled.div`
  font-size: calc(var(--font-size-large) * 1.3);
  font-weight: 700;
  letter-spacing: 2px;
  line-height: 0.9;
  
  a {
    display: flex;
    flex-direction: column;
    text-align: left;
  }

  .visuals {
    margin-left: 3rem;
    font-size: 0.3em;
    letter-spacing: 2px;
    margin-top: 4px;
  }
  
  @media (max-width: 480px) {
    font-size: calc(var(--font-size-medium) * 1.3);
    
    .visuals {
      margin-left: 2rem;
      letter-spacing: 1.5px;
      margin-top: 4px;
    }
  }
`;

const Nav = styled.nav`
  @media (max-width: 768px) {
    display: none;
  }
`;

const NavList = styled.ul`
  display: flex;
  list-style: none;
  gap: var(--spacing-lg);
  align-items: center;
`;

const NavItem = styled.li`
  display: flex;
  align-items: center;
`;

const IconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: 1px solid var(--color-text-light);
  border-radius: 50%;
  cursor: pointer;
  color: var(--color-text-light);
  padding: 8px;
  transition: all 0.3s ease;
  width: 36px;
  height: 36px;

  &:hover {
    background: var(--color-text-light);
    color: var(--color-background);
  }
`;

const MobileMenuButton = styled.button<{ $isOpen: boolean }>`
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  
  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    color: var(--color-text-light);
    z-index: var(--z-index-menu);
    position: relative;
  }
`;

const MenuIcon = styled.div<{ $isOpen: boolean }>`
  position: relative;
  width: 24px;
  height: 2px;
  background-color: ${props => props.$isOpen ? 'transparent' : 'var(--color-text-light)'};
  transition: all 0.3s ease;
  
  &:before, &:after {
    content: '';
    position: absolute;
    width: 24px;
    height: 2px;
    background-color: var(--color-text-light);
    transition: all 0.3s ease;
  }
  
  &:before {
    transform: ${props => props.$isOpen ? 'rotate(45deg)' : 'translateY(-8px)'};
  }
  
  &:after {
    transform: ${props => props.$isOpen ? 'rotate(-45deg)' : 'translateY(8px)'};
  }
`;

const MobileMenu = styled(motion.div)`
  display: none;
  
  @media (max-width: 768px) {
    display: flex;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.95);
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: var(--z-index-modal);
  }
`;

const MobileNavList = styled(motion.ul)`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
  text-align: center;
`;

const MobileNavItem = styled(motion.li)`
  font-size: var(--font-size-xlarge);
  font-weight: 600;
  
  a {
    color: var(--color-text-light);
    transition: color var(--transition-fast);
    
    &:hover {
      color: var(--color-accent);
    }
  }
`;

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    // Prevent scrolling when menu is open
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleNavigation = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    e.stopPropagation();
    window.location.href = href;
  };
  
  const menuVariants = {
    closed: {
      opacity: 0,
      y: "-100%",
      transition: {
        duration: 0.5,
        when: "afterChildren",
        staggerChildren: 0.1,
        staggerDirection: -1
      }
    },
    open: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1,
        staggerDirection: 1
      }
    }
  };
  
  const itemVariants = {
    closed: { opacity: 0, y: 20 },
    open: { opacity: 1, y: 0 }
  };
  
  const handleScrollDown = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  };

  const handleDownload = () => {
    // Ganti dengan URL file yang ingin didownload
    const fileUrl = '/files/company-profile.pdf';
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = 'LAPIS-Company-Profile.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <HeaderContainer $scrolled={scrolled || isMenuOpen}>
      <HeaderContent>
        <Logo>
          <Link href="/" onClick={(e) => handleNavigation(e, '/')}>
            <span>LAPIS</span>
            <span className="visuals">VISUALS</span>
          </Link>
        </Logo>
        
        <Nav>
          <NavList>
            <NavItem>
              <Link href="/contact" onClick={(e) => handleNavigation(e, '/contact')}>
                Contact
              </Link>
            </NavItem>
            <NavItem>
              <Link href="/services" onClick={(e) => handleNavigation(e, '/services')}>
                Services
              </Link>
            </NavItem>
            <NavItem>
              <IconButton onClick={handleDownload} title="Download Company Profile">
                <Download size={18} />
              </IconButton>
            </NavItem>
          </NavList>
        </Nav>
        
        <MobileMenuButton 
          $isOpen={isMenuOpen} 
          onClick={toggleMenu} 
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          <MenuIcon $isOpen={isMenuOpen} />
        </MobileMenuButton>
      </HeaderContent>
      
      <AnimatePresence>
        {isMenuOpen && (
          <MobileMenu
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
          >
            <MobileNavList>
              <MobileNavItem variants={itemVariants}>
                <Link href="/contact" onClick={(e) => { handleNavigation(e, '/contact'); closeMenu(); }}>
                  Contact
                </Link>
              </MobileNavItem>
              <MobileNavItem variants={itemVariants}>
                <Link href="/services" onClick={(e) => { handleNavigation(e, '/services'); closeMenu(); }}>
                  Services
                </Link>
              </MobileNavItem>
            </MobileNavList>
          </MobileMenu>
        )}
      </AnimatePresence>
    </HeaderContainer>
  );
}
