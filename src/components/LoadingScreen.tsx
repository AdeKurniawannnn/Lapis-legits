'use client';

import { useEffect, useState } from 'react';
import styles from './LoadingScreen.module.css';

const LoadingScreen = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [text, setText] = useState('');
  const [bufferingProgress, setBufferingProgress] = useState(0);
  const fullText = 'LAPIS';
  const [showSubtitle, setShowSubtitle] = useState(false);

  useEffect(() => {
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
        setShowSubtitle(true);
      }
    }, 150);

    // Simulasi buffering video
    let progress = 0;
    const bufferingInterval = setInterval(() => {
      progress += Math.random() * 10;
      if (progress >= 100) {
        progress = 100;
        clearInterval(bufferingInterval);
        // Tunggu sebentar setelah buffering selesai
        setTimeout(() => {
          setIsLoading(false);
        }, 500);
      }
      setBufferingProgress(Math.min(progress, 100));
    }, 200);

    return () => {
      clearInterval(typingInterval);
      clearInterval(bufferingInterval);
    };
  }, []);

  if (!isLoading) return null;

  return (
    <div className={styles.loadingScreen}>
      <div className={styles.loader}>
        <div className={styles.logoContainer}>
          <h1 className={styles.typingText}>{text}</h1>
          <span className={styles.cursor}>|</span>
        </div>
        {showSubtitle && (
          <div className={styles.bufferingContainer}>
            <p className={styles.subtitle}>Loading...</p>
            <div className={styles.progressBar}>
              <div 
                className={styles.progress} 
                style={{ width: `${bufferingProgress}%` }}
              ></div>
            </div>
            <p className={styles.progressText}>{Math.round(bufferingProgress)}%</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoadingScreen; 