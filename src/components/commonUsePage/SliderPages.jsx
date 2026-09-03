"use client";
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import styles from "./slide.module.scss";

gsap.registerPlugin(ScrollTrigger);

const cardsContent = [
  {
    id: 1,
    title: "Why you Choose Us",
    description:
      "We provide top-notch services that cater to your needs. Our team of experts ensures that you receive the best solutions tailored to your requirements.",
    color: "#000000",
  },
  {
    id: 2,
    title: "My Services",
    description:
      "Discover our range of professional services designed to meet your unique needs.",
    color: "#ff0000",
  },
  {
    id: 3,
    title: "Case Studies",
    description:
      "Explore our successful projects and see how we've helped businesses like yours.",
    color: "#33ff00",
  },
  {
    id: 4,
    title: "Contact Us",
    description:
      "Get in touch with us to discuss your project and how we can help.",
    color: "#00d9ff",
  },
];

export default function StackScroll() {
  const containerRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    // 1. Synchronize Lenis with GSAP ScrollTrigger
    const lenis = new Lenis();

    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    // 2. GSAP Context setup
    const ctx = gsap.context(() => {
      const cards = cardsRef.current.filter(Boolean);

      cards.forEach((card, index) => {
        // Higher cards sit above earlier cards as you scroll down
        gsap.set(card, { zIndex: index + 1 });

        // Skip pinning the last card so content flows naturally after
        if (index < cards.length - 0) {
          ScrollTrigger.create({
            trigger: card,
            start: "top top",
            endTrigger: containerRef.current,
            end: "bottom bottom",
            pin: true,
            pinSpacing: false,
            scrub: true,
          });
        }
      });
    }, containerRef);

    return () => {
      ctx.revert();
      lenis.destroy();
      gsap.ticker.remove((time) => lenis.raf(time * 1000));
    };
  }, []);

  return (
    <div ref={containerRef} className={styles.stackContainer} style={{ backgroundImage: `url(/cardimg/aurora-gradient-1788444210431.webp)` }}>
      {cardsContent.map((card, i) => (
        <div
          key={card.id}
          ref={(el) => (cardsRef.current[i] = el)}
          className={styles.cardWrapper}
        >
          <div className={styles.card} style={{ "--card-accent": card.color }}>
            {/* Visual backdrop blur glow */}
            <div className={styles.glowEffect} />

            {/* Header bar with card index badge */}
            <div className={styles.cardHeader}>
              <span className={styles.badge}>0{card.id}</span>
              <span className={styles.tag}>FEATURED WORK</span>
            </div>

            {/* Body content */}
            <div className={styles.cardBody}>
              <h1 className={styles.title}>{card.title}</h1>
              <p className={styles.description}>{card.description}</p>
            </div>

            {/* Interactive footer action */}
            <div className={styles.cardFooter}>
              <span className={styles.actionText}>Explore Case Study</span>
              <div className={styles.arrowIcon}>↗</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
