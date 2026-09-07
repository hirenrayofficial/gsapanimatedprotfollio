import React, { useRef } from "react";
import "../style/header.scss";

import { motion } from "framer-motion";

export default function Header() {
  const containerRef = useRef(null);
  return (
    <div ref={containerRef} className="header-container">
      <motion.div
        className="left-header"
        initial={{ y: -10, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        onClick={(e) => (window.location.href = "/")}
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
          <a href="/blog">Blog</a>
        </div>
        <div className="link-header">
          <a href="/about">About</a>
        </div>

        <div className="link-header">
          <a href="/contact">Contact</a>
        </div>
        <div className="link-header">
          <a href="/privacy">Privacy</a>
        </div>
        <div className="link-header">
          <a href="/terms">Terms</a>
        </div>
      </motion.div>
      <motion.div
        className="right-header"
        initial={{ y: -20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="link-header">
          <a href="/contact">Contact</a>
        </div>
      </motion.div>
    </div>
  );
}
