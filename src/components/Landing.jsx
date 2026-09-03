import React, { useEffect, useState, useRef } from "react";
import "./style/heroStyle.scss";

import { motion, useScroll, useTransform, useInView } from "framer-motion";

export default function Landing() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: false, margin: "-100px" });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { y: 60, opacity: 0, rotate: -5 },
    visible: {
      y: 0,
      opacity: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
        duration: 0.6,
      },
    },
  };

  return (
    <div ref={containerRef} className="landing-container-main">
      <div className="landing-component">
        <div className="who-i-am">
          <motion.span
            id="Own"
            initial={{ y: 40, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            Hiren Ray
          </motion.span>
          <motion.div
            className="i-desk"
            initial={{ y: 40, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <span>Learn Anything AnyTime </span>
            <span>Jay Baba Bhola Nath</span>
          </motion.div>
        </div>
        <div className="center-hero">
          <div className="job-tag">
            <motion.p
              initial={{ x: 80, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 1 }}
            >
              Junior Full Stack Developer
            </motion.p>
            <img src="/curved-arrow.png" alt="" style={{ width: "60px" }} />
          </div>
          <motion.div
            className="owener-img"
            initial={{ y: -80, opacity: 1 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <img src="/hirenray.png" alt="" />
          </motion.div>
        </div>
        <motion.div
          className="what-i-do"
          initial={{ x: 80, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <span id="Own">What I Do</span>
          <div className="i-desk">
            <span>
              I Do Every Complex Work in esay way adn specialy i solved the real
              world project problem{" "}
            </span>
            {/* <span>Jay Baba Bhola Nath</span>  */}
            <motion.div
              className="l-arroe"
              // initial={{ x: -80, opacity: 0 }}
              // whileInView={{ x: 0, opacity: 1 }}
              // transition={{ duration: 0.7 }}
            >
              <img src="/curved-arrow.png" alt="" style={{ width: "60px" }} />
            </motion.div>
          </div>
        </motion.div>
      </div>
      <motion.div
        className="bottom-hero-content"
        initial={{ y: 80, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <span id="bottom-span-a">MANY STARTUP MANY BUISNESS</span>
        <span>& GROWING IN EFECTIVE PRICE</span>
        <span id="bottom-span-a">WITH GET POSETIVE RESPONSE & RELATION</span>
      </motion.div>
      <div className="optional"></div>
    </div>
  );
}
