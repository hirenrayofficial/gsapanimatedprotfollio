import React, { useRef } from "react";
import "../style/header.scss";

import { motion, useScroll, useTransform, useInView } from "framer-motion";

export default function Header() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: false, margin: "-100px" });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });
  return (
    <div ref={containerRef} className="header-container">
      <motion.div
        className="left-header"
        initial={{ y: -10, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <span>RAY</span>
      </motion.div>
      <motion.div
        className="center-header"
        initial={{ y: -20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="link-header">
          <a href="/about">About</a>
        </div>
        <div className="link-header">
          <a href="/about">Project</a>
        </div>
        <div className="link-header">
          <a href="/about">Contact</a>
        </div>
      </motion.div>
      <motion.div className="right-header"         initial={{ y: -20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}>
        <div className="link-header">
          <a href="/talk">Talk</a>
        </div>
      </motion.div>
    </div>
  );
}
