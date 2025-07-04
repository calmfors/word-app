'use client';
import React, { useEffect, useState } from 'react';
import styles from "../subpages.module.css";
import { useRouter } from 'next/navigation';

export default function Header({timer, setTimer, startTimer, duration, keyboardOpen, intervalRef}) {
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
    <header className={`${styles.header} ${keyboardOpen && window.innerWidth < 768 ? styles.keyboardOpen : ''}`}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
        <path fill="#0099ff" d="M0,288L30,266.7C60,245,120,203,180,170.7C240,139,300,117,360,128C420,139,480,181,540,181.3C600,181,660,139,720,128C780,117,840,139,900,165.3C960,192,1020,224,1080,224C1140,224,1200,192,1260,181.3C1320,171,1380,181,1410,186.7L1440,192L1440,0L1410,0C1380,0,1320,0,1260,0C1200,0,1140,0,1080,0C1020,0,960,0,900,0C840,0,780,0,720,0C660,0,600,0,540,0C480,0,420,0,360,0C300,0,240,0,180,0C120,0,60,0,30,0L0,0Z"></path>
      </svg>
      <button className={styles.backButton} onClick={() => router.back()}></button>
      <div className={styles.timer}>
        <span>
          {Math.floor(timer / 60)}:{timer % 60 < 10 ? `0${timer % 60}` : timer % 60}
        </span>
      </div>
    </header>
  );
}