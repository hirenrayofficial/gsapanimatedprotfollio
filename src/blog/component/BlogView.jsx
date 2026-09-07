import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import "../style/blogview.scss";
import "@fontsource-variable/inter/wght.css";

export default function BlogView({ blog = [] }) {
  const siteUrl = "https://hirenray.rest";
  const pageUrl = `${siteUrl}/blog`;

  // Dynamic ItemList Schema for AI Indexing and Google Search
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Writing & Thoughts by Hiren Ray",
    "description": "Articles, insights, and software engineering thoughts by Full Stack Engineer Hiren Ray.",
    "url": pageUrl,
    "numberOfItems": blog.length,
    "itemListElement": blog.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "url": `${siteUrl}/blog/${item.slug}`,
      "name": item.blog_title,
      "description": item.blog_description || ""
    }))
  };

  return (
    <main className="blog-container">
      {/* Inject Structured Data Schema */}
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(itemListSchema)}</script>
      </Helmet>

      <header className="blog-header">
        <span className="blog-label">Index</span>
        <h1 className="blog-heading">Writing & Thoughts</h1>
        <p className="blog-subheading">
          Technical articles, engineering insights, and thoughts by{" "}
          <strong>Hiren Ray</strong>.
        </p>
      </header>

      {!blog.length ? (
        <p className="no-blogs">No articles published yet.</p>
      ) : (
        <section className="blog-grid" aria-label="Blog posts list">
          {blog.map((item, index) => (
            <article className="blog-card" key={item.id || item.slug || index}>
              <Link to={`/blog/${item.slug}`} className="blog-card-inner-link">
                <div className="blog-card-image-wrapper">
                  <img
                    src={item.imageUrl || "/aurora-gradient-1788443208608.webp"}
                    alt={item.blog_title}
                    className="blog-card-image"
                    loading={index < 3 ? "eager" : "lazy"}
                  />
                </div>
                <div className="blog-card-content">
                  <time className="blog-date" dateTime={item.createdAt || item.createAt}>
                    {item.createdAt || item.createAt}
                  </time>
                  <div className="blog-content">
                    <h2 className="blog-title">{item?.blog_title}</h2>
                    <p className="blog-description">{item?.blog_description}</p>
                  </div>
                  <div className="blog-action">
                    <span className="read-link">Read Article →</span>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}