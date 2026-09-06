import React from "react";
import "../style/footer.scss";
import "@fontsource-variable/inter/wght.css";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-brand">
            <a href="/" className="logo">
              <span className="logo-dot"></span>
              <span className="logo-text">journal.</span>
            </a>
            <p className="footer-tagline">
              A minimalist publication focusing on design, engineering, and modern web development.
            </p>
          </div>

          <div className="footer-nav">
            <div className="footer-col">
              <span className="col-title">Navigation</span>
              <a href="#articles">Articles</a>
              <a href="#about">About</a>
              <a href="#newsletter">Newsletter</a>
            </div>
            <div className="footer-col">
              <span className="col-title">Social</span>
              <a href="https://twitter.com" target="_blank" rel="noreferrer">Twitter / X</a>
              <a href="https://github.com" target="_blank" rel="noreferrer">GitHub</a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer">LinkedIn</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="copyright">
            © {new Date().getFullYear()} journal. All rights reserved.
          </p>
          <div className="legal-links">
            <a href="#privacy">Privacy Policy</a>
            <span className="dot">•</span>
            <a href="#terms">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}