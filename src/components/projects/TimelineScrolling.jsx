import React, { useEffect, useRef } from "react";
import "./timelinesc.scss";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function HoraizentalContent() {
  const containerRef = useRef(null);
  const mirrorRef = useRef(null);

  const projectData = [
    {
      id: 1,
      project_title: "Moonlight Machinery Paper plate making Machine",
      project_description:
        "Moonlight Machinery is a leading manufacturer of paper plate making machines. We offer a wide range of machines that are designed to meet the needs of our customers. Our machines are made from high-quality materials and are built to last.",
      project_image: "/nodeporxy.png",
      project_link: "https://www.moonlightmachinery.com/",
      project_bg_image: "/cardimg/aurora-gradient-1788443397099.webp",
    },
    {
      id: 2,
      project_title: "NodeProxy Mini Nginx Npm Packege For Proxy Server",
      project_description:
        "NodeProxy is a mini Nginx npm package that allows you to easily set up a proxy server for your Node.js applications. It is lightweight and easy to use, making it a great choice for developers who need to quickly set up a proxy server.",
      project_image: "/nodeporxy.png",
      project_link: "https://rexayray008.hirenray.rest/#nodeproxy",
      project_bg_image: "/aurora-gradient-1788443208608.webp",
    },
    {
      id: 3,
      project_title: "Note Selling Android Application ",
      project_description:
        "The morder selling app with 0 backend setup only use firebase ",
      project_image: "/nodeporxy.png",
      project_link: "/",
      project_bg_image: "/cardimg/aurora-gradient-1788443448593.webp",
    },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      const container = containerRef.current;
      const mirror = mirrorRef.current;

      // Card width + Gap spacing from CSS
      const cardWidth =
        mirror.querySelector(".horai-project-content")?.offsetWidth || 0;
      const gap = 20;
      const shiftDistance = cardWidth + gap;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: `+=${projectData.length * 950}`, // Increased scroll distance for smooth pauses
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        },
      });

      // 1. Initial pause for the 1st card in center
      tl.to({}, { duration: 1 });

      // 2. Animate and pause for remaining cards dynamically
      for (let i = 1; i < projectData.length; i++) {
        // Move to next card
        tl.to(mirror, {
          x: -shiftDistance * i,
          duration: 1.5,
          ease: "power2.inOut",
        })
          // Pause card at screen center
          .to({}, { duration: 1 });
      }
    }, containerRef);

    return () => ctx.revert();
  }, [projectData.length]);

  return (
    <div className="mask-ani">
      <div className="project-carda" ref={containerRef}>
        <div className="main-mirrora" ref={mirrorRef}>
          {projectData?.map((data, index) => (
            <div className="horai-project-content" style={{ backgroundImage: `url(${data.project_bg_image || data.project_image})` }} key={data.id}>
              <div className="image-section">
                <div className="image-wrapper">
                  <img src={data.project_image} alt={data.project_title} />
                </div>
              </div>

              <div className="left-contne">
                <span className="project-index">0{index + 1}</span>
                <h2>{data.project_title}</h2>
                <p>{data.project_description}</p>

                <div className="project-action">
                  <a
                    href={data.project_link}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-primary"
                  >
                    View Project <span>→</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
