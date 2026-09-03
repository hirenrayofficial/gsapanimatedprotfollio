import React, { useEffect, useRef } from "react";
import "./project.scss";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Project() {
  const containerRef = useRef(null);
  const mirrorRef = useRef(null);
  const overlayRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const container = containerRef.current;
      const mirror = mirrorRef.current;
      const overlay = overlayRef.current;

      gsap.set(mirror, {
        opacity: 0,
        y: 0,
        scale: 1,
      });

      gsap.set(overlay, {
        "--mouse-x": "50%",
        "--mouse-y": "50%",
      });

      const syncMaskWithMirror = () => {
        const containerRect = container.getBoundingClientRect();
        const mirrorRect = mirror.getBoundingClientRect();

        const centerX =
          ((mirrorRect.left + mirrorRect.width / 2 - containerRect.left) /
            containerRect.width) *
          100;
        const centerY =
          ((mirrorRect.top + mirrorRect.height / 2 - containerRect.top) /
            containerRect.height) *
          100;

        const radius = mirrorRect.width / 2;

        gsap.set(overlay, {
          "--mouse-x": `${centerX}%`,
          "--mouse-y": `${centerY}%`,
          "--mask-radius": `${radius}px`,
        });
      };

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: "+=2500",
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          onUpdate: syncMaskWithMirror,
        },
      });

      tl.to(mirror, {
        opacity: 0,
        y: -50,
        duration: 1,
        ease: "power2.out",
      }).to({}, { duration: 0.3 })
      .to(mirror, {
        scale: 10,
        duration: 1.5,
        ease: "power2.inOut",
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="mask-ani">
      <div className="project-card" ref={containerRef}>
        {/* Layer 1: Background Content (Revealed inside mask) */}
        <div className="background-image">
          <img
            src="/aurora-gradient-1788443208608.webp"
            alt="Background"
            className="bg-img"
          />
          <div className="bg-content">
            <h1>Hii Main Hiren</h1>
            <p>Welcome to my creative universe</p>
            <button className="cta-btn">Explore Projects</button>
            <img src="/hirenray-removebg-preview.png"></img>
          </div>
        </div>

        {/* Layer 2: Top Cover (Masked out) */}
        <div className="black-overlay" ref={overlayRef}>
          {/* <h2>Scroll to Reveal</h2>
          <p>Discover what lies underneath</p> */}
        </div>

        {/* Layer 3: Mask Driver */}
        <div className="main-mirror" ref={mirrorRef}></div>
      </div>
    </div>
  );
}