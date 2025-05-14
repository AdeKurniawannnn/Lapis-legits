import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import StyledComponentsRegistry from '@/lib/registry';
import '@/styles/globals.css';
import LoadingScreen from '@/components/LoadingScreen';
import { ModalProvider } from '@/context/ModalContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'LAPIS - Video Production Agency',
  description: 'LAPIS is a video production agency specializing in high-quality video content creation.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <LoadingScreen />
        <StyledComponentsRegistry>
          <ModalProvider>
            {children}
          </ModalProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
