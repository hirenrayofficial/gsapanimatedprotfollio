import React, { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import edjsHTML from "editorjs-html";
import "../style/blogreader.scss";

// Custom parser extensions for special Editor.js blocks
const customParsers = {
  checklist: (block) => {
    const items = (block.data?.items || [])
      .map(
        (item) =>
          `<li class="checklist-item ${item.checked ? "checked" : ""}">
            <span class="checkbox">${item.checked ? "✓" : ""}</span>
            <span>${item.text}</span>
          </li>`,
      )
      .join("");
    return `<ul class="editor-checklist">${items}</ul>`;
  },
  delimiter: () => `<div class="editor-delimiter">•••</div>`,
  code: (block) =>
    `<pre class="editor-code"><code>${block.data?.code || ""}</code></pre>`,
};

const edjsParser = edjsHTML(customParsers);

export default function BlogPostReader() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);

  const api = process.env.REACT_APP_API_END_POINT || "";
  const siteUrl = "https://hirenray.rest";
  const currentUrl = `${siteUrl}/blog/${slug}`;

  // Scroll Progress Indicator
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentProgress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(currentProgress);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch Blog Post
  useEffect(() => {
    if (!slug) return;

    setLoading(true);
    fetch(`${api}/api/blogs/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error("Post not found");
        return res.json();
      })
      .then((data) => {
        setBlog(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load post:", err);
        setLoading(false);
      });
  }, [slug, api]);

  // Safely parse content object
  const rawContent = useMemo(() => {
    if (!blog?.content) return null;
    if (typeof blog.content === "string") {
      try {
        return JSON.parse(blog.content);
      } catch (e) {
        console.error("Failed to parse blog content string:", e);
        return null;
      }
    }
    return blog.content;
  }, [blog]);

  // Estimate Read Time (WPM = 200)
  const readTime = useMemo(() => {
    if (!rawContent?.blocks || !Array.isArray(rawContent.blocks)) return "1 min";
    const textContent = rawContent.blocks
      .map((block) => block.data?.text || "")
      .join(" ");
    const words = textContent.trim().split(/\s+/).filter(Boolean).length;
    const minutes = Math.ceil(words / 200);
    return `${minutes || 1} min read`;
  }, [rawContent]);

  // Extract first paragraph for AEO key takeaway box
  const firstParagraph = useMemo(() => {
    if (!rawContent?.blocks || !Array.isArray(rawContent.blocks)) return "";
    const pBlock = rawContent.blocks.find((b) => b.type === "paragraph");
    return pBlock ? pBlock.data?.text?.replace(/<[^>]*>?/gm, "") : "";
  }, [rawContent]);

  // Convert Editor.js JSON blocks to HTML array
  const parsedBlocks = useMemo(() => {
    if (!rawContent || !Array.isArray(rawContent.blocks)) return [];
    try {
      const result = edjsParser.parse(rawContent);
      if (Array.isArray(result)) return result;
      return [];
    } catch (err) {
      console.error("Error parsing Editor.js blocks:", err);
      return [];
    }
  }, [rawContent]);

  const handleShare = (platform) => {
    const url = window.location.href;
    const text = `Check out this article by Hiren Ray: ${blog?.blog_title}`;

    if (platform === "twitter") {
      window.open(
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
        "_blank",
      );
    } else if (platform === "linkedin") {
      window.open(
        `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
        "_blank",
      );
    } else if (platform === "copy") {
      navigator.clipboard.writeText(url);
      alert("Link copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <div className="reader-state">
        <span className="loader"></span>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="reader-state">
        <p>Post not found.</p>
        <Link to="/blog" className="back-link">
          ← Return to Blog Index
        </Link>
      </div>
    );
  }

  // Schema Markup for SEO / AEO Search Engines
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": blog.blog_title,
    "description": blog.blog_description || firstParagraph,
    "image": blog.imageUrl ? [blog.imageUrl] : [],
    "datePublished": blog.createdAt || blog.createAt,
    "dateModified": blog.updatedAt || blog.createdAt || blog.createAt,
    "author": {
      "@type": "Person",
      "name": "Hiren Ray",
      "url": siteUrl,
      "jobTitle": "Full Stack Engineer"
    },
    "publisher": {
      "@type": "Person",
      "name": "Hiren Ray",
      "url": siteUrl
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": currentUrl
    }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": siteUrl
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Blog",
        "item": `${siteUrl}/blog`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": blog.blog_title,
        "item": currentUrl
      }
    ]
  };

  return (
    <div className="blog-reader-page">
      {/* Dynamic SEO, AEO, and OpenGraph Meta Tags */}
      <Helmet>
        <title>{`${blog.blog_title} | Hiren Ray`}</title>
        <meta name="description" content={blog.blog_description || firstParagraph} />
        <link rel="canonical" href={currentUrl} />

        {/* OpenGraph / Facebook */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={blog.blog_title} />
        <meta property="og:description" content={blog.blog_description || firstParagraph} />
        <meta property="og:url" content={currentUrl} />
        {blog.imageUrl && <meta property="og:image" content={blog.imageUrl} />}

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={blog.blog_title} />
        <meta name="twitter:description" content={blog.blog_description || firstParagraph} />
        {blog.imageUrl && <meta name="twitter:image" content={blog.imageUrl} />}

        {/* Inject JSON-LD Schemas */}
        <script type="application/ld+json">{JSON.stringify(schemaData)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>

      {/* Top Reading Progress Bar */}
      <div
        className="scroll-progress-bar"
        style={{ width: `${scrollProgress}%` }}
      />

      <main className="reader-container">
        {/* Semantic Breadcrumbs (SEO & Indexing) */}
        <nav className="reader-nav" aria-label="Breadcrumb">
          <ol className="breadcrumb-list">
            <li><Link to="/">Home</Link></li>
            <li><span>/</span></li>
            <li><Link to="/blog">Blog</Link></li>
            <li><span>/</span></li>
            <li aria-current="page">{blog.blog_title}</li>
          </ol>
        </nav>

        {/* Article Metadata Header */}
        <header className="reader-header">
          <div className="meta-bar">
            <time className="reader-date" dateTime={blog.createdAt || blog.createAt}>
              {blog.createdAt || blog.createAt}
            </time>
            <span className="dot">•</span>
            <span className="read-time">{readTime}</span>
          </div>

          <h1 className="reader-title">{blog.blog_title}</h1>

          {blog.blog_description && (
            <p className="reader-subtitle">{blog.blog_description}</p>
          )}

          {/* Author Details & Social Share Bar */}
          <div className="author-share-bar">
            <div className="author-info">
              <div className="author-avatar">HR</div>
              <div className="author-meta">
                <span className="author-name">Hiren Ray</span>
                <span className="author-role">Full Stack Engineer</span>
              </div>
            </div>

            <div className="share-actions">
              <button
                onClick={() => handleShare("twitter")}
                title="Share on Twitter/X"
              >
                X
              </button>
              <button
                onClick={() => handleShare("linkedin")}
                title="Share on LinkedIn"
              >
                in
              </button>
              <button onClick={() => handleShare("copy")} title="Copy Link">
                🔗
              </button>
            </div>
          </div>
        </header>

        {/* Hero Cover Image */}
        {blog.imageUrl && (
          <div className="reader-cover-wrapper">
            <img
              src={blog.imageUrl}
              alt={blog.blog_title}
              className="reader-cover-image"
              loading="eager"
            />
          </div>
        )}

        {/* AEO / GEO Optimization: Direct Answer / Executive Summary Box */}
        {firstParagraph && (
          <aside className="aeo-summary-box" aria-label="Key Takeaways">
            <strong>Key Takeaways (TL;DR):</strong>
            <p>{firstParagraph}</p>
          </aside>
        )}

        {/* Article Content Render */}
        <article className="reader-body">
          {parsedBlocks.map((htmlString, index) => (
            <div
              key={`block-${index}`}
              dangerouslySetInnerHTML={{ __html: htmlString }}
            />
          ))}
        </article>

        {/* Footer Actions */}
        <footer className="reader-footer">
          <div className="footer-share">
            <span>Share this article:</span>
            <div className="share-actions">
              <button onClick={() => handleShare("twitter")}>Twitter</button>
              <button onClick={() => handleShare("linkedin")}>LinkedIn</button>
              <button onClick={() => handleShare("copy")}>Copy Link</button>
            </div>
          </div>

          <div className="footer-navigation">
            <Link to="/blog" className="back-to-index">
              ← Back to all articles
            </Link>
          </div>
        </footer>
      </main>
    </div>
  );
}