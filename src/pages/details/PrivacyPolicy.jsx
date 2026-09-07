import React from 'react';
import styles from './PrivacyPolicy.module.scss';

export default function PrivacyPolicy() {
  return (
    <div className={styles.privacyWrapper}>
      <div className={styles.container}>
        {/* Header */}
        <header className={styles.header}>
          <h1>Privacy Policy</h1>
          <p className={styles.lastUpdated}>
            Last updated: September 7, 2026
          </p>
        </header>

        {/* Policy Body */}
        <div className={styles.contentCard}>
          <section>
            <h2>1. Introduction</h2>
            <p>
              Welcome to our website. We respect your privacy and are committed to protecting your personal data. This Privacy Policy outlines how we collect, use, and protect your information when you visit our blog and portfolio platform.
            </p>
          </section>

          <section>
            <h2>2. Information We Collect</h2>
            <p>We may collect personal and non-personal data when you interact with our website:</p>
            <ul>
              <li><strong>Personal Data:</strong> Name and email address provided voluntarily when submitting a message via our contact form.</li>
              <li><strong>Log Data & Analytics:</strong> IP address, browser type, operating system, referring URLs, and page view statistics gathered automatically through standard web server logs.</li>
            </ul>
          </section>

          <section>
            <h2>3. Cookies & Tracking Technologies</h2>
            <p>
              Our website uses cookies and similar tracking technologies to enhance user experience, analyze site usage, and serve personalized content and advertisements.
            </p>
            <p>
              Cookies are small files stored on your device that enable us to recognize your browser on future visits. You can control or disable cookie settings directly through your web browser.
            </p>
          </section>

          {/* AdSense Mandatory Compliance Section */}
          <section>
            <h2>4. Third-Party Advertising & Google AdSense</h2>
            <p>
              We use third-party advertising companies, including Google AdSense, to serve ads when you visit our website. These companies may use cookies and web beacons to collect non-personally identifiable information about your visits to this and other websites in order to provide advertisements about goods and services of interest to you.
            </p>
            <ul>
              <li>Google, as a third-party vendor, uses cookies to serve ads on this website.</li>
              <li>Google's use of advertising cookies enables it and its partners to serve ads to users based on their visit to this site or other sites on the Internet.</li>
              <li>
                Users may opt out of personalized advertising by visiting{' '}
                <a 
                  href="https://www.google.com/settings/ads" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Google Ads Settings
                </a>.
              </li>
            </ul>
          </section>

          <section>
            <h2>5. Third-Party Links</h2>
            <p>
              Our website may contain links to external third-party websites or services that are not operated by us. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party websites.
            </p>
          </section>

          <section>
            <h2>6. Data Security</h2>
            <p>
              We implement industry-standard security measures to protect your personal information. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2>7. Contact Us</h2>
            <p>
              If you have any questions or concerns regarding this Privacy Policy, please feel free to reach out to us via our Contact Page or email us directly at <strong>contact@hirenray.rest</strong>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}