import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import '../style/landing-preload.scss';
import "@fontsource/silkscreen/400.css";
import "@fontsource/silkscreen/700.css";

gsap.registerPlugin(ScrollTrigger);

const ProfessionalPreloader = ({ children }) => {
  const loaderRef = useRef(null);
  const containerRef = useRef(null);
  const words = ["H", "I", "R", "E", "N"];
  
  // Check if the preloader has already played during this session
  const [hasLoaded, setHasLoaded] = useState(() => {
    return sessionStorage.getItem("hasPreloaded") === "true";
  });
  
  const [isReady, setIsReady] = useState(hasLoaded);

  useEffect(() => {
    // Skip animation entirely if already shown before
    if (hasLoaded) return;

    const chars = containerRef.current.querySelectorAll(".char");
    const tl = gsap.timeline({
      onComplete: () => {
        setTimeout(() => {
          setIsReady(true);
          sessionStorage.setItem("hasPreloaded", "true"); // Save state so navigation links don't trigger it again
        }, 500);
      }
    });

    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';

    gsap.set(chars, { autoAlpha: 0, scale: 0.8, y: 50 });

    chars.forEach((char, index) => {
      if (index === 0) {
        tl.to(char, { 
          autoAlpha: 1, 
          scale: 1, 
          y: 0, 
          duration: 1, 
          ease: "expo.out" 
        });
      } else {
        const prevChars = Array.from(chars).slice(0, index);
        const shiftAmount = window.innerWidth < 508 ? 80 : 140;

        tl.to(char, { 
          x: (index * shiftAmount) / 2, 
          autoAlpha: 1, 
          duration: 0.5, 
          ease: "power4.inOut" 
        }, "-=0.2");

        tl.to(prevChars, { 
          x: `-=${shiftAmount / 2}`, 
          rotate: -8, 
          duration: 0.15, 
          ease: "power2.out" 
        }, "-=0.35");

        tl.to(Array.from(chars).slice(0, index + 1), { 
          rotate: 0, 
          y: 0,
          x: (i) => (i * shiftAmount) - ((index * shiftAmount) / 2), 
          duration: 0.8, 
          ease: "elastic.out(1, 0.5)" 
        }, "-=0.1");
      }
    });

    tl.to(containerRef.current, { 
      x: 5, 
      duration: 0.05, 
      repeat: 3, 
      yoyo: true 
    }, "-=0.2");
    
    tl.to(containerRef.current, { 
      x: 0, 
      duration: 0.1 
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [hasLoaded]);

  // --- SLIDE UP ANIMATION ---
  useEffect(() => {
    if (!isReady || hasLoaded) return;

    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.width = '';
    
    gsap.to(loaderRef.current, {
      yPercent: -100,
      duration: 1.2,
      ease: "power3.inOut",
      onComplete: () => {
        if (loaderRef.current) {
          loaderRef.current.style.display = 'none';
        }
      }
    });
  }, [isReady, hasLoaded]);

  // If already loaded on previous route visits, skip rendering the loader markup
  if (hasLoaded) {
    return <main className="main-content">{children}</main>;
  }

  return (
    <>
      <div 
        className="loader-container" 
        ref={loaderRef}
        style={{ 
          pointerEvents: isReady ? 'none' : 'auto'
        }}
      >
        <div className="char-wrapper" ref={containerRef}>
          {words.map((w, i) => (
            <span key={i} className="char">{w}</span>
          ))}
        </div>
        <div className="scroll-indicator">
          {isReady ? "✨ Ready!" : "Loading..."}
        </div>
      </div>
      
      <main className="main-content">
        {children}
      </main>
    </>
  );
};

export default ProfessionalPreloader;