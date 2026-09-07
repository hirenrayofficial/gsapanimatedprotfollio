import React from "react";
import "../style/header.scss";
import "@fontsource-variable/inter/wght.css";

export default function Header() {
  return (
    <header className="site-header">
      <div className="header-container">
        <a href="/blog" className="logo">
          <span className="logo-dot"></span>
          <span className="logo-text">HRBLOG.</span>
        </a>

        <nav className="header-nav">
          <a href="#articles" className="nav-link active">Articles</a>
          <a href="#about" className="nav-link">About</a>
          {/* <a href="#newsletter" className="nav-link">Newsletter</a> */}
        </nav>

        <div className="header-actions">
          <button className="subscribe-btn">Subscribe</button>
        </div>
      </div>
    </header>
  );
}