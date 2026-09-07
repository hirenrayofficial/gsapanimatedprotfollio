import React, { useState, useEffect } from 'react';
import styles from './CookieConsent.module.scss';

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookieConsent', 'declined');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className={styles.bannerWrapper}>
      <div className={styles.card}>
        <div className={styles.header}>
          <span className={styles.icon}>🍪</span>
          <h3>Cookie Preferences</h3>
        </div>

        <p>
          We use cookies to personalize content, analyze site traffic, and serve targeted ads via Google AdSense. Read our{' '}
          <a href="/privacy">Privacy Policy</a> to learn more.
        </p>

        <div className={styles.btnGroup}>
          <button onClick={handleDecline} className={styles.declineBtn}>
            Decline
          </button>
          <button onClick={handleAccept} className={styles.acceptBtn}>
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
}