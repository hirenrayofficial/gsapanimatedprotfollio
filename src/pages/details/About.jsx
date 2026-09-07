import React from 'react';
import styles from './About.module.scss';

export default function About() {
  return (
    <div className={styles.aboutWrapper}>
      <div className={styles.container}>
        {/* Header */}
        <header className={styles.header}>
          <span className={styles.badge}>About The Platform</span>
          <h1>Empowering Digital Growth & Web Engineering</h1>
          <p>
            Welcome to our portfolio and technical blog platform—dedicated to modern web development, SEO strategies, and full-stack application architecture.
          </p>
        </header>

        {/* Mission Statement */}
        <section className={styles.card}>
          <h2>Our Mission</h2>
          <p>
            This platform was built to bridge the gap between high-performance web engineering and search engine optimization. We create in-depth tutorials, breakdown modern frameworks, and document real-world software solutions to help developers and business owners build faster, discoverable web applications.
          </p>
          <p>
            Whether you are exploring modern Javascript frameworks, optimizing site performance for core web vitals, or structuring full-stack applications, our goal is to deliver actionable, well-researched insights.
          </p>
        </section>

        {/* Value Grid */}
        <div className={styles.gridTwo}>
          <div className={styles.valueCard}>
            <div className={styles.icon}>⚡</div>
            <h3>Quality Content</h3>
            <p>
              Every article and case study published here is thoroughly tested and written from hands-on practical experience in web development.
            </p>
          </div>

          <div className={styles.valueCard}>
            <div className={styles.icon}>🎯</div>
            <h3>SEO & Performance First</h3>
            <p>
              We focus on clean architecture, lightning-fast render times, and structured metadata to ensure maximum visibility and usability.
            </p>
          </div>
        </div>

        {/* Author / Publisher Section (Crucial for AdSense) */}
        <section className={styles.authorCard}>
          <div className={styles.avatar}>H</div>
          <div className={styles.authorInfo}>
            <h3>Hiren Ray</h3>
            <div className={styles.role}>Full Stack Engineer & Platform Author</div>
            <p>
              Passionate software engineer specializing in MERN stack development, cloud deployment, and digital optimization. Dedicated to writing clear, accessible, and high-value technical articles for the developer community.
            </p>

            <div className={styles.skillsSection}>
              <h3>Core Focus Areas</h3>
              <div className={styles.tags}>
                <span>React / Next.js</span>
                <span>Node.js</span>
                <span>SEO Optimization</span>
                <span>MERN Stack</span>
                <span>Web Performance</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}