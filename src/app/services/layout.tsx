'use client';

import Header from '@/components/layout/Header';
import { motion } from 'framer-motion';
import styled from 'styled-components';

const PageWrapper = styled(motion.div)`
  min-height: 100vh;
  background-color: var(--color-background);
  color: var(--color-text);
  overflow-x: hidden;
  width: 100%;
  position: relative;

  @media (max-width: 768px) {
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }
`;

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PageWrapper
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Header />
      {children}
    </PageWrapper>
  );
} 