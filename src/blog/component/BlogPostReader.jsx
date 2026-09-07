import React, { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import edjsHTML from "editorjs-html";
import "../style/blogreader.scss";

// Full Editor.js block coverage.
// editorjs-html ships defaults for header/paragraph/list/quote/code/delimiter/
// image/embed/table/linkTool/raw — we override several for cleaner markup +
// SEO-friendly attributes (lazy loading, alt text, captions) and add the
// tools it doesn't cover out of the box (checklist, warning, alert, personality).
const customParsers = {
  checklist: (block) => {
    const items = (block.data?.items || [])
      .map(
        (item) => `
          <li class="checklist-item ${item.checked ? "checked" : ""}">
            <span class="checkbox">${item.checked ? "✓" : ""}</span>
            <span>${item.text}</span>
          </li>`,
      )
      .join("");
    return `<ul class="editor-checklist">${items}</ul>`;
  },

  delimiter: () => `<div class="editor-delimiter">•••</div>`,

  code: (block) =>
    `<pre class="editor-code"><code>${escapeHtml(block.data?.code || "")}</code></pre>`,

  header: (block) => {
    const level = Math.min(Math.max(block.data?.level || 2, 1), 6);
    return `<h${level} id="${slugifyHeading(block.data?.text)}">${block.data?.text || ""}</h${level}>`;
  },

  paragraph: (block) => `<p>${block.data?.text || ""}</p>`,

  list: (block) => {
    const tag = block.data?.style === "ordered" ? "ol" : "ul";
    const items = (block.data?.items || [])
      .map(
        (item) => `<li>${typeof item === "string" ? item : item.content}</li>`,
      )
      .join("");
    return `<${tag}>${items}</${tag}>`;
  },

  quote: (block) => `
    <figure class="editor-quote">
      <blockquote>${block.data?.text || ""}</blockquote>
      ${block.data?.caption ? `<figcaption>${block.data.caption}</figcaption>` : ""}
    </figure>`,

  warning: (block) => `
    <div class="editor-warning" role="alert">
      ${block.data?.title ? `<strong>${block.data.title}</strong>` : ""}
      <p>${block.data?.message || ""}</p>
    </div>`,

  alert: (block) => `
    <div class="editor-alert editor-alert--${block.data?.type || "primary"}" role="status">
      ${block.data?.align ? "" : ""}
      <p>${block.data?.message || ""}</p>
    </div>`,

  personality: (block) => `
    <figure class="editor-personality">
      ${block.data?.photo ? `<img src="${block.data.photo}" alt="${block.data?.name || ""}" loading="lazy" width="80" height="80" />` : ""}
      <figcaption>
        <strong>${block.data?.name || ""}</strong>
        ${block.data?.description ? `<p>${block.data.description}</p>` : ""}
      </figcaption>
    </figure>`,

  image: (block) => {
    const url = block.data?.file?.url || block.data?.url || "";
    const caption = block.data?.caption || "";
    const withBorder = block.data?.withBorder ? "editor-image--bordered" : "";
    const stretched = block.data?.stretched ? "editor-image--stretched" : "";
    return `
      <figure class="editor-image ${withBorder} ${stretched}">
        <img src="${url}" alt="${caption || "Article image"}" loading="lazy" />
        ${caption ? `<figcaption>${caption}</figcaption>` : ""}
      </figure>`;
  },

  table: (block) => {
    const rows = block.data?.content || [];
    const [head, ...body] = rows;
    const hasHeadings = !!block.data?.withHeadings && head;
    const headHtml = hasHeadings
      ? `<thead><tr>${head.map((c) => `<th>${c}</th>`).join("")}</tr></thead>`
      : "";
    const bodyRows = hasHeadings ? body : rows;
    const bodyHtml = `<tbody>${bodyRows
      .map((row) => `<tr>${row.map((c) => `<td>${c}</td>`).join("")}</tr>`)
      .join("")}</tbody>`;
    return `<div class="editor-table-wrap"><table class="editor-table">${headHtml}${bodyHtml}</table></div>`;
  },

  linkTool: (block) => {
    const meta = block.data?.meta || {};
    const link = block.data?.link || "#";
    return `
      <a class="editor-linktool" href="${link}" target="_blank" rel="noopener noreferrer">
        <div class="editor-linktool-content">
          ${meta.title ? `<strong>${meta.title}</strong>` : ""}
          ${meta.description ? `<p>${meta.description}</p>` : ""}
          <span class="editor-linktool-url">${link}</span>
        </div>
        ${meta.image?.url ? `<img src="${meta.image.url}" alt="" loading="lazy" />` : ""}
      </a>`;
  },

  embed: (block) => `
    <div class="editor-embed">
      <iframe
        src="${block.data?.embed || ""}"
        title="${block.data?.caption || "Embedded content"}"
        loading="lazy"
        allowfullscreen
      ></iframe>
      ${block.data?.caption ? `<p class="editor-embed-caption">${block.data.caption}</p>` : ""}
    </div>`,

  raw: (block) => block.data?.html || "",
};

const edjsParser = edjsHTML(customParsers);

function escapeHtml(str = "") {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function slugifyHeading(text = "") {
  return text
    .toLowerCase()
    .replace(/<[^>]*>?/gm, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function stripTags(html = "") {
  return html
    .replace(/<[^>]*>?/gm, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export default function BlogPostReader() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const api = process.env.REACT_APP_API_END_POINT || "";
  const siteUrl = "https://hirenray.rest";
  const currentUrl = `${siteUrl}/blog/${slug}`;
  console.log(currentUrl)

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress((window.scrollY / totalHeight) * 100);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setNotFound(false);

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
        setNotFound(true);
        setLoading(false);
      });
  }, [slug, api]);

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

  // Full plain-text of every block — used for word count AND the schema's
  // articleBody, which matters far more for AEO/LLM overviews than a single
  // opening paragraph.
  const fullText = useMemo(() => {
    if (!rawContent?.blocks || !Array.isArray(rawContent.blocks)) return "";
    return rawContent.blocks
      .map((b) => {
        if (b.data?.text) return stripTags(b.data.text);
        if (b.data?.items) {
          return b.data.items
            .map((i) => (typeof i === "string" ? i : i.text || i.content || ""))
            .join(" ");
        }
        if (b.data?.message) return stripTags(b.data.message);
        if (b.data?.caption) return stripTags(b.data.caption);
        return "";
      })
      .join(" ")
      .trim();
  }, [rawContent]);

  const readTime = useMemo(() => {
    const words = fullText.split(/\s+/).filter(Boolean).length;
    const minutes = Math.ceil(words / 200);
    return `${minutes || 1} min read`;
  }, [fullText]);

  const firstParagraph = useMemo(() => {
    if (!rawContent?.blocks || !Array.isArray(rawContent.blocks)) return "";
    const pBlock = rawContent.blocks.find((b) => b.type === "paragraph");
    return pBlock ? stripTags(pBlock.data?.text || "") : "";
  }, [rawContent]);

  const parsedBlocks = useMemo(() => {
    if (!rawContent || !Array.isArray(rawContent.blocks)) return [];

    return rawContent.blocks
      .map((block, idx) => {
        try {
          const parser = customParsers[block.type];
          if (parser) return parser(block);

          // fallback to the library's built-in parser for any type
          // we didn't override above
          const result = edjsParser.parse({ blocks: [block] });
          return Array.isArray(result) ? result[0] : "";
        } catch (err) {
          console.error(
            `[BlogPostReader] Failed to render block #${idx} (type: "${block.type}")`,
            err,
            block,
          );
          return ""; // skip just this block, keep the rest
        }
      })
      .filter(Boolean);
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
        <Helmet>
          <meta name="robots" content="noindex" />
        </Helmet>
        <span className="loader"></span>
      </div>
    );
  }

  if (!blog || notFound) {
    // No hard 404 status is possible from an SPA, so at minimum tell crawlers
    // not to index this URL — a real 404 status still belongs at the server/CDN.
    return (
      <div className="reader-state">
        <Helmet>
          <title>Post not found | Hiren Ray</title>
          <meta name="robots" content="noindex, follow" />
        </Helmet>
        <p>Post not found.</p>
        <Link to="/blog" className="back-link">
          ← Return to Blog Index
        </Link>
      </div>
    );
  }

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blog.blog_title,
    description: blog.blog_description || firstParagraph,
    articleBody: fullText,
    wordCount: fullText.split(/\s+/).filter(Boolean).length,
    image: blog.imageUrl ? [blog.imageUrl] : [],
    datePublished: blog.createdAt || blog.createAt,
    dateModified: blog.updatedAt || blog.createdAt || blog.createAt,
    author: {
      "@type": "Person",
      name: "Hiren Ray",
      url: siteUrl,
      jobTitle: "Full Stack Engineer",
    },
    publisher: {
      "@type": "Person",
      name: "Hiren Ray",
      url: siteUrl,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": currentUrl,
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: `${siteUrl}/blog`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: blog.blog_title,
        item: currentUrl,
      },
    ],
  };

  return (
    <div className="blog-reader-page">
      <Helmet>
        <html lang="en" />
        <title>{`${blog.blog_title} | Hiren Ray`}</title>
        <meta
          name="description"
          content={blog.blog_description || firstParagraph}
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={currentUrl} />

        <meta property="og:type" content="article" />
        <meta property="og:title" content={blog.blog_title} />
        <meta
          property="og:description"
          content={blog.blog_description || firstParagraph}
        />
        <meta property="og:url" content={currentUrl} />
        {blog.imageUrl && <meta property="og:image" content={blog.imageUrl} />}

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={blog.blog_title} />
        <meta
          name="twitter:description"
          content={blog.blog_description || firstParagraph}
        />
        {blog.imageUrl && <meta name="twitter:image" content={blog.imageUrl} />}

        <script type="application/ld+json">{JSON.stringify(schemaData)}</script>
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      </Helmet>

      <div
        className="scroll-progress-bar"
        style={{ width: `${scrollProgress}%` }}
      />

      <main className="reader-container">
        <nav className="reader-nav" aria-label="Breadcrumb">
          <ol className="breadcrumb-list">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <span>/</span>
            </li>
            <li>
              <Link to="/blog">Blog</Link>
            </li>
            <li>
              <span>/</span>
            </li>
            <li aria-current="page">{blog.blog_title}</li>
          </ol>
        </nav>

        <header className="reader-header">
          <div className="meta-bar">
            <time
              className="reader-date"
              dateTime={blog.createdAt || blog.createAt}
            >
              {blog.createdAt || blog.createAt}
            </time>
            <span className="dot">•</span>
            <span className="read-time">{readTime}</span>
          </div>

          <h1 className="reader-title">{blog.blog_title}</h1>

          {blog.blog_description && (
            <p className="reader-subtitle">{blog.blog_description}</p>
          )}

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

        {/* {blog.imageUrl && (
          <div className="reader-cover-wrapper">
            <img
              src={blog.imageUrl}
              alt={blog.blog_title}
              className="reader-cover-image"
              loading="eager"
              fetchpriority="high"
            />
          </div>
        )} */}

        {/* {firstParagraph && (
          <aside className="aeo-summary-box" aria-label="Key Takeaways">
            <strong>Key Takeaways (TL;DR):</strong>
            <p>{firstParagraph}</p>
          </aside>
        )} */}

        <article className="reader-body">
          {parsedBlocks.map((htmlString, index) => (
            <div
              key={`block-${index}`}
              dangerouslySetInnerHTML={{ __html: htmlString }}
            />
          ))}
        </article>

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
