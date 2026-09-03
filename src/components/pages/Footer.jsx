"use client";
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import styles from "./footer.module.scss";

gsap.registerPlugin(ScrollTrigger);

export default function ModernFooter() {
  const footerRef = useRef(null);
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const linksRef = useRef([]);

  useEffect(() => {
    // 1. Initialize Lenis Smooth Scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    lenis.on("scroll", ScrollTrigger.update);

    const updateRaf = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateRaf);
    gsap.ticker.lagSmoothing(0);

    // 2. GSAP Animations with ScrollTrigger
    const ctx = gsap.context(() => {
      // Big Title Reveal Animation
      gsap.fromTo(
        titleRef.current,
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: "power4.out",
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top 70%",
            end: "bottom bottom",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Navigation Links Stagger Reveal
      const validLinks = linksRef.current.filter(Boolean);
      gsap.fromTo(
        validLinks,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top 60%",
          },
        }
      );
    }, containerRef);

    return () => {
      ctx.revert();
      lenis.destroy();
      gsap.ticker.remove(updateRaf);
    };
  }, []);

  return (
    <div ref={containerRef} className={styles.footerWrapper}>
      <footer ref={footerRef} className={styles.footer}>
        <div className={styles.container}>
          {/* Main Call To Action */}
          <div className={styles.topSection}>
            <p className={styles.subheading}>Have a project in mind?</p>
            <h1 ref={titleRef} className={styles.bigTitle}>
              LET'S TALK <span className={styles.arrow}>→</span>
            </h1>
          </div>

          {/* Grid Navigation */}
          <div className={styles.gridSection}>
            <div className={styles.col}>
              <h4>Navigation</h4>
              <ul>
                {["Home", "Work", "About", "Contact"].map((item, i) => (
                  <li key={item} ref={(el) => (linksRef.current[i] = el)}>
                    <a href={`#${item.toLowerCase()}`}>{item}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.col}>
              <h4>Socials</h4>
              <ul>
                {["Twitter / X", "LinkedIn", "GitHub", "Instagram"].map((item, i) => (
                  <li key={item} ref={(el) => (linksRef.current[i + 4] = el)}>
                    <a href="/" target="_blank" rel="noreferrer">{item}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.col}>
              <h4>Location</h4>
              <p>San Francisco, CA</p>
              <p>12:00 PM PST</p>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className={styles.bottomBar}>
            <span>© {new Date().getFullYear()} Modern Studio. All Rights Reserved.</span>
            <span>Back to Top ↑</span>
          </div>
        </div>
      </footer>
    </div>
  );
}