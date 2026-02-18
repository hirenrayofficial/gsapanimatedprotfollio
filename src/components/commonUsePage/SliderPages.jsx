"use client";
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import styles from "./slide.module.scss";

gsap.registerPlugin(ScrollTrigger);

const pages = [
  { id: 1, tag: "Rafiki", bgColor:"black", title: "Guide", desc: "Desc", button: "Learn", image: "/hirenray.png" },
  { id: 2, tag: "Mentor", bgColor:"orange", title: "Grow", desc: "Desc", button: "Discover", image: "/p-2.webp" },
  { id: 3, tag: "Hero", bgColor:"blue", title: "Support", desc: "Desc", button: "Explore", image: "/p-1.webp" },
  { id: 4, tag: "Hero",  bgColor:"green",title: "Support", desc: "Desc", button: "Explore", image: "/p-1.webp" },
];

export default function StackScroll() {
  const containerRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    // 1. Smooth Scroll Setup (Lenis)
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Custom easing for smoothness
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // 2. GSAP Animations
    let ctx = gsap.context(() => {
      const cards = cardsRef.current.filter(Boolean);
      
      cards.forEach((card, index) => {
        const cardInner = card.querySelector(`.${styles.card}`);
        
        const isLast = index === cards.length - 1;
        // Sticky Stacking Effect
        ScrollTrigger.create({
          trigger: card,
          start: "top top", 
          pin: true,
          pinSpacing: false, // Isse cards ek ke upar ek stack honge
          scrub: true,
        });

        // Entrance & Exit Animation for each card (except the last one)
        if (!isLast) {
          
          gsap.to(cardInner, {
            scrollTrigger: {
              trigger: card,
              start: "top top",
              end: "bottom top",
              // pin:true,
              scrub: true,
              // pinSpacingL:true,
              // autoAlpha: 0,
            },
            autoAlpha:1,
            scale: 0.85,          // Card chota hoga jab peeche jayega
            opacity: 1,         // Thoda fade hoga
            // filter: "blur(4px)",  // Depth effect
            // y: 50,               // Halka sa upar move karega
          });
        }
      });
    }, containerRef);

    return () => {
      ctx.revert(); // Cleanup
      lenis.destroy();
    };
  }, []);

  return (
    <div ref={containerRef} className={styles.stackContainer}>
      {pages.map((page, i) => (
        <section
          key={page.id}
          ref={(el) => (cardsRef.current[i] = el)}
          className={styles.cardWrapper}
        >
          <div className={styles.card} style={{background: page.bgColor}}>
            <div className={styles.imageContainer}>
               <img src={page.image} alt={page.title} />
            </div>
            <div className={styles.content}>
               <span>{page.tag}</span>
               <h2>{page.title}</h2>
               <p>{page.desc}</p>
               <button>{page.button}</button>
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}