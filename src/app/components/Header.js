'use client';
import React, { useEffect, useState } from 'react';
import styles from "../subpages.module.css";
import { useRouter } from 'next/navigation';

export default function Header({ timer, setTimer, startTimer, duration, keyboardOpen, intervalRef, hideSvg }) {
  const router = useRouter();
  const [returnToPreviousPage, setReturnToPreviousPage] = useState(false);
  const [cloud, setCloud] = useState(false);
  const [darkCloud, setDarkCloud] = useState(false);
  const [lightning, setLightning] = useState(false);
  const [cloudDelay, setCloudDelay] = useState(Math.floor(Math.random() * 60) + 10);
  const randomPositions = [100, 120, 140, 160, 180, 200];
  const [cloudTop, setCloudTop] = useState(Math.floor(randomPositions[Math.floor(Math.random() * randomPositions.length)]));
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    setReturnToPreviousPage(params.get('return') === 'true');
  }, []);

  useEffect(() => {
    if (startTimer) {
      countDown();
      setCloudDelay(Math.floor(Math.random() * 60) + 10);
      setCloudTop(Math.floor(randomPositions[Math.floor(Math.random() * randomPositions.length)]));
      setCloud(true);
    }
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
      setCloud(false);
    }
  }, [timer]);

  return (
    <>
      <header className={`${styles.header} ${keyboardOpen && window.innerWidth < 768 ? styles.keyboardOpen : ''}`}>
        {!hideSvg && <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path fill="#0099ff" d="M0,288L30,266.7C60,245,120,203,180,170.7C240,139,300,117,360,128C420,139,480,181,540,181.3C600,181,660,139,720,128C780,117,840,139,900,165.3C960,192,1020,224,1080,224C1140,224,1200,192,1260,181.3C1320,171,1380,181,1410,186.7L1440,192L1440,0L1410,0C1380,0,1320,0,1260,0C1200,0,1140,0,1080,0C1020,0,960,0,900,0C840,0,780,0,720,0C660,0,600,0,540,0C480,0,420,0,360,0C300,0,240,0,180,0C120,0,60,0,30,0L0,0Z"></path>
        </svg>}
        <div className={styles.widthLimiter}>
          {!hideSvg && <svg id="sun" fill="#fcdb33" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 122.88 122.88"><path d="M30,13.21A3.93,3.93,0,1,1,36.8,9.27L41.86,18A3.94,3.94,0,1,1,35.05,22L30,13.21Zm31.45,13A35.23,35.23,0,1,1,36.52,36.52,35.13,35.13,0,0,1,61.44,26.2ZM58.31,4A3.95,3.95,0,1,1,66.2,4V14.06a3.95,3.95,0,1,1-7.89,0V4ZM87.49,10.1A3.93,3.93,0,1,1,94.3,14l-5.06,8.76a3.93,3.93,0,1,1-6.81-3.92l5.06-8.75ZM109.67,30a3.93,3.93,0,1,1,3.94,6.81l-8.75,5.06a3.94,3.94,0,1,1-4-6.81L109.67,30Zm9.26,28.32a3.95,3.95,0,1,1,0,7.89H108.82a3.95,3.95,0,1,1,0-7.89Zm-6.15,29.18a3.93,3.93,0,1,1-3.91,6.81l-8.76-5.06A3.93,3.93,0,1,1,104,82.43l8.75,5.06ZM92.89,109.67a3.93,3.93,0,1,1-6.81,3.94L81,104.86a3.94,3.94,0,0,1,6.81-4l5.06,8.76Zm-28.32,9.26a3.95,3.95,0,1,1-7.89,0V108.82a3.95,3.95,0,1,1,7.89,0v10.11Zm-29.18-6.15a3.93,3.93,0,0,1-6.81-3.91l5.06-8.76A3.93,3.93,0,1,1,40.45,104l-5.06,8.75ZM13.21,92.89a3.93,3.93,0,1,1-3.94-6.81L18,81A3.94,3.94,0,1,1,22,87.83l-8.76,5.06ZM4,64.57a3.95,3.95,0,1,1,0-7.89H14.06a3.95,3.95,0,1,1,0,7.89ZM10.1,35.39A3.93,3.93,0,1,1,14,28.58l8.76,5.06a3.93,3.93,0,1,1-3.92,6.81L10.1,35.39Z" /></svg>}
          <button className={styles.backButton} onClick={() => returnToPreviousPage ? router.back() : router.push('/')}></button>
          {!isNaN(timer) && <div className={styles.timer} style={{ color: timer < 11 ? 'red' : '' }}>
            <span>
              {Math.floor(timer / 60)}:{timer % 60 < 10 ? `0${timer % 60}` : timer % 60}
            </span>
          </div>}
        </div>
      </header>
      {cloud && <div className={styles.cloudContainer} style={{ animationDelay: `${cloudDelay}s`, top: `${cloudTop}px` }}>
        <div className={styles.cloud + (darkCloud ? ` ${styles.active}` : '')} onClick={() => {
          document.body.style.backgroundColor = '#bbb';
          setDarkCloud(true);
          const audio = new Audio('/thunder.mp3');
          audio.play();
          setTimeout(() => setLightning(true), 800);
          setTimeout(() => {
            setLightning(false); setDarkCloud(false); document.body.style.backgroundColor = 'unset';
          }, 1000);
        }}>
          <svg width="425" height="265" version="1.1" viewBox="0 0 112.45 70.115" xmlns="http://www.w3.org/2000/svg"><path d="m18.604 69.763c-7.9562-3.5058-18.253-9.1152-18.253-19.633 0-10.518 9.8283-17.296 18.955-17.062-3.9781-11.686 3.0421-30.384 18.955-32.488 15.912-2.1035 21.061 10.751 23.869 15.893 2.6062-0.95018 9.8708-4.1752 15.934-0.27632 5.951 3.8265 6.8247 10.058 6.7643 13.131 5.3822-0.70117 23.869-1.4023 26.911 15.893 3.0421 17.296-14.274 24.541-14.274 24.541z" fill="#f9f9f9" /></svg>
        </div>
        <div className={styles.lightning + (lightning ? ` ${styles.active}` : '')}>
          <svg width="76" height="160" version="1.1" viewBox="0 0 20.108 42.333" xmlns="http://www.w3.org/2000/svg"><path d="m12.66 42.143-12.205-18.906 10.96-10.199-8.22-12.687h7.9709l8.4691 12.189-14.198 11.443z" fill="#ffd42a" /></svg>
        </div>
      </div>}
    </>
  );
}