import React, { useEffect, useRef } from "react";
import "./Horaizental.scss";
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

      // ---- start state ----
      gsap.set(mirror, {
        opacity: 0, // invisible rahega hamesha, sirf mask ko drive karega
        y: 500,
        scale: 1,
      });

      gsap.set(overlay, {
        "--mask-radius": "0px",
        "--mouse-x": "50%",
        "--mouse-y": "50%",
      });

      // ye function mirror ki current real position/size nikal ke
      // black-overlay ke mask variables me daal deta hai
      const syncMaskWithMirror = () => {
        const containerRect = container.getBoundingClientRect();
        const mirrorRect = mirror.getBoundingClientRect();

        // mirror ka center point container ke andar % me
        const centerX =
          ((mirrorRect.left + mirrorRect.width / 2 - containerRect.left) /
            containerRect.width) *
          100;
        const centerY =
          ((mirrorRect.top + mirrorRect.height / 2 - containerRect.top) /
            containerRect.height) *
          100;

        // radius = mirror ki current width ka aadha (scale ke saath khud badhega)
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
          onUpdate: syncMaskWithMirror, // har scroll-frame pe mask sync hoga
        },
      });

      tl
        // 1) mirror niche se center tak aata hai
        .to(mirror, {
          opacity: 0, // hamesha invisible hi rahega
          y: -50,
          duration: 1,
          ease: "power2.out",
        })

        // 2) thoda hold
        .to({}, { duration: 0.3 })

        // 3) mirror scale hoke bada hota hai -> mask radius bhi apne aap badhega
        .to(mirror, {
          scale: 10,
          duration: 1.5,
          ease: "power2.inOut",
        })

        // // 4) scroll khatam -> mirror wapas chhota/original position pe
        // .to(mirror, {
        //   scale: 1,
        //   y: 300,
        //   duration: 0.5,
        // });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="mask-ani">
      <div className="project-card" ref={containerRef}>
        <div className="background-image">
          <img
            src="/aurora-gradient-1788443208608.webp"
            alt="Background"
          />
        </div>

        <div className="black-overlay" ref={overlayRef}>
          <h2>Circle Mask Effect</h2>
          <p>Scroll karke dekhein!</p>
        </div>

        {/* ye div bilkul invisible rahega, sirf mask ko drive karega */}
        <div className="main-mirror" ref={mirrorRef}></div>
      </div>
    </div>
  );
}