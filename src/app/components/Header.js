'use client';
import React, { useEffect, useState } from 'react';
import styles from "../subpages.module.css";
import { useRouter } from 'next/navigation';

export default function Header({ timer, setTimer, startTimer, duration, keyboardOpen, intervalRef }) {
  const router = useRouter();

  useEffect(() => {
    if (startTimer) countDown();
  }, [startTimer]);

  const countDown = () => {
    if (!intervalRef.current && timer === duration) {
      intervalRef.current = setInterval(() => {
        setTimer(prev => prev > 0 ? prev - 1 : 0);
      }, 1000);
    }
  };

  useEffect(() => {
    if (timer === 0 && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [timer]);

  return (
    <>
      <header className={`${styles.header} ${keyboardOpen && window.innerWidth < 768 ? styles.keyboardOpen : ''}`}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path fill="#0099ff" d="M0,288L30,266.7C60,245,120,203,180,170.7C240,139,300,117,360,128C420,139,480,181,540,181.3C600,181,660,139,720,128C780,117,840,139,900,165.3C960,192,1020,224,1080,224C1140,224,1200,192,1260,181.3C1320,171,1380,181,1410,186.7L1440,192L1440,0L1410,0C1380,0,1320,0,1260,0C1200,0,1140,0,1080,0C1020,0,960,0,900,0C840,0,780,0,720,0C660,0,600,0,540,0C480,0,420,0,360,0C300,0,240,0,180,0C120,0,60,0,30,0L0,0Z"></path>
        </svg>
        <div className={styles.widthLimiter}>
          <svg id="sun" fill="#fcdb33" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 122.88 122.88"><path d="M30,13.21A3.93,3.93,0,1,1,36.8,9.27L41.86,18A3.94,3.94,0,1,1,35.05,22L30,13.21Zm31.45,13A35.23,35.23,0,1,1,36.52,36.52,35.13,35.13,0,0,1,61.44,26.2ZM58.31,4A3.95,3.95,0,1,1,66.2,4V14.06a3.95,3.95,0,1,1-7.89,0V4ZM87.49,10.1A3.93,3.93,0,1,1,94.3,14l-5.06,8.76a3.93,3.93,0,1,1-6.81-3.92l5.06-8.75ZM109.67,30a3.93,3.93,0,1,1,3.94,6.81l-8.75,5.06a3.94,3.94,0,1,1-4-6.81L109.67,30Zm9.26,28.32a3.95,3.95,0,1,1,0,7.89H108.82a3.95,3.95,0,1,1,0-7.89Zm-6.15,29.18a3.93,3.93,0,1,1-3.91,6.81l-8.76-5.06A3.93,3.93,0,1,1,104,82.43l8.75,5.06ZM92.89,109.67a3.93,3.93,0,1,1-6.81,3.94L81,104.86a3.94,3.94,0,0,1,6.81-4l5.06,8.76Zm-28.32,9.26a3.95,3.95,0,1,1-7.89,0V108.82a3.95,3.95,0,1,1,7.89,0v10.11Zm-29.18-6.15a3.93,3.93,0,0,1-6.81-3.91l5.06-8.76A3.93,3.93,0,1,1,40.45,104l-5.06,8.75ZM13.21,92.89a3.93,3.93,0,1,1-3.94-6.81L18,81A3.94,3.94,0,1,1,22,87.83l-8.76,5.06ZM4,64.57a3.95,3.95,0,1,1,0-7.89H14.06a3.95,3.95,0,1,1,0,7.89ZM10.1,35.39A3.93,3.93,0,1,1,14,28.58l8.76,5.06a3.93,3.93,0,1,1-3.92,6.81L10.1,35.39Z" /></svg>
          <button className={styles.backButton} onClick={() => router.back()}></button>

        </div>
      </header>
      <div className={styles.timer} style={{ color: timer < 11 ? 'red' : '' }}>
        <span>
          {Math.floor(timer / 60)}:{timer % 60 < 10 ? `0${timer % 60}` : timer % 60}
        </span>
      </div>
    </>
  );
}