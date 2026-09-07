import React from 'react';
import styles from './TermsOfService.module.scss';

export default function TermsOfService() {
  return (
    <div className={styles.termsWrapper}>
      <div className={styles.container}>
        {/* Header */}
        <header className={styles.header}>
          <h1>Terms of Service</h1>
          <p className={styles.lastUpdated}>
            Last updated: September 7, 2026
          </p>
        </header>

        {/* Content Body */}
        <div className={styles.contentCard}>
          <section>
            <h2>1. Agreement to Terms</h2>
            <p>
              By accessing or using our portfolio and blog platform, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree with any part of these terms, you may not access or use this website.
            </p>
          </section>

          <section>
            <h2>2. Intellectual Property Rights</h2>
            <p>
              Unless otherwise indicated, all content on this site—including text, graphics, code snippets, logos, and article materials—is our intellectual property and protected by applicable copyright and trademark laws.
            </p>
            <p>
              You are granted a limited, non-exclusive license to access and view the content for personal, non-commercial use. You may not republish, reproduce, or redistribute site content without explicit written permission.
            </p>
          </section>

          <section>
            <h2>3. User Conduct</h2>
            <p>When using this website, you agree not to:</p>
            <ul>
              <li>Use the site for any unlawful purpose or in violation of local, national, or international laws.</li>
              <li>Attempt to disrupt, breach, or compromise website security or server infrastructure.</li>
              <li>Engage in automated data scraping, harvesting, or spamming via contact forms.</li>
              <li>Post or transmit harmful, offensive, or defamatory content.</li>
            </ul>
          </section>

          <section>
            <h2>4. Advertisements & Third-Party Links</h2>
            <p>
              This website displays third-party advertisements served via Google AdSense and may contain links to external third-party websites.
            </p>
            <p>
              We do not control, endorse, or assume responsibility for any third-party content, services, or product offers displayed in advertisements or linked resources. Interactions with third parties are solely between you and the respective provider.
            </p>
          </section>

          <section>
            <h2>5. Disclaimer of Warranties</h2>
            <p>
              All information, articles, code samples, and resources on this site are provided on an <strong>"as is"</strong> and <strong>"as available"</strong> basis without warranties of any kind, whether express or implied.
            </p>
            <p>
              While we strive to ensure all information and code examples are accurate and up-to-date, we do not guarantee completeness, reliability, or accuracy.
            </p>
          </section>

          <section>
            <h2>6. Limitation of Liability</h2>
            <p>
              In no event shall the website owner, author, or affiliates be liable for any direct, indirect, incidental, or consequential damages resulting from your use or inability to use this site or its content.
            </p>
          </section>

          <section>
            <h2>7. Changes to Terms</h2>
            <p>
              We reserve the right to revise or update these Terms of Service at any time. Changes will be posted directly on this page with an updated "Last updated" date. Continued use of the website after updates constitutes acceptance of the new terms.
            </p>
          </section>

          <section>
            <h2>8. Contact Information</h2>
            <p>
              If you have any questions or concerns regarding these Terms of Service, please contact us via our Contact Page or email us directly at <strong>contact@hirenray.rest</strong>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}