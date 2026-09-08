import React, {
  useEffect,
  useMemo,
  useState,
} from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import DOMPurify from "dompurify";
import edjsHTML from "editorjs-html";
import "../style/blogreader.scss";

/* -------------------------------------------------------
   Helpers
------------------------------------------------------- */

function escapeHtml(str = "") {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function stripTags(html = "") {
  return String(html)
    .replace(/<[^>]*>?/gm, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function slugifyHeading(text = "") {
  return stripTags(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function formatDate(date) {
  if (!date) return "";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return parsed.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/* -------------------------------------------------------
   Editor.js custom parsers
------------------------------------------------------- */

const customParsers = {
  checklist: (block) => {
    const items = (block.data?.items || [])
      .map((item) => {
        const checked = Boolean(item.checked);

        return `
          <li class="checklist-item ${checked ? "checked" : ""}">
            <span class="checkbox" aria-hidden="true">
              ${checked ? "✓" : ""}
            </span>
            <span>${escapeHtml(item.text || "")}</span>
          </li>
        `;
      })
      .join("");

    return `
      <ul class="editor-checklist">
        ${items}
      </ul>
    `;
  },

  delimiter: () => `
    <div class="editor-delimiter" aria-hidden="true">
      •••
    </div>
  `,

  code: (block) => `
    <pre class="editor-code">
      <code>${escapeHtml(block.data?.code || "")}</code>
    </pre>
  `,

  header: (block) => {
    const level = Math.min(
      Math.max(Number(block.data?.level) || 2, 1),
      6
    );

    const text = block.data?.text || "";
    const id = slugifyHeading(text);

    return `
      <h${level}${id ? ` id="${id}"` : ""}>
        ${text}
      </h${level}>
    `;
  },

  paragraph: (block) => `
    <p>${block.data?.text || ""}</p>
  `,

  list: (block) => {
    const tag =
      block.data?.style === "ordered"
        ? "ol"
        : "ul";

    const items = (block.data?.items || [])
      .map((item) => {
        const content =
          typeof item === "string"
            ? item
            : item?.content || item?.text || "";

        return `<li>${content}</li>`;
      })
      .join("");

    return `
      <${tag}>
        ${items}
      </${tag}>
    `;
  },

  quote: (block) => `
    <figure class="editor-quote">
      <blockquote>
        ${block.data?.text || ""}
      </blockquote>

      ${
        block.data?.caption
          ? `<figcaption>${block.data.caption}</figcaption>`
          : ""
      }
    </figure>
  `,

  warning: (block) => `
    <aside class="editor-warning" role="note">
      ${
        block.data?.title
          ? `<strong>${block.data.title}</strong>`
          : ""
      }

      <p>${block.data?.message || ""}</p>
    </aside>
  `,

  alert: (block) => `
    <aside
      class="editor-alert editor-alert--${
        block.data?.type || "primary"
      }"
      role="note"
    >
      <p>${block.data?.message || ""}</p>
    </aside>
  `,

  personality: (block) => `
    <figure class="editor-personality">
      ${
        block.data?.photo
          ? `
            <img
              src="${escapeHtml(block.data.photo)}"
              alt="${escapeHtml(block.data?.name || "Author")}"
              loading="lazy"
              width="80"
              height="80"
            />
          `
          : ""
      }

      <figcaption>
        ${
          block.data?.name
            ? `<strong>${block.data.name}</strong>`
            : ""
        }

        ${
          block.data?.description
            ? `<p>${block.data.description}</p>`
            : ""
        }
      </figcaption>
    </figure>
  `,

  image: (block) => {
    const url =
      block.data?.file?.url ||
      block.data?.url ||
      "";

    if (!url) return "";

    const caption = block.data?.caption || "";

    const withBorder = block.data?.withBorder
      ? "editor-image--bordered"
      : "";

    const stretched = block.data?.stretched
      ? "editor-image--stretched"
      : "";

    return `
      <figure class="editor-image ${withBorder} ${stretched}">
        <img
          src="${escapeHtml(url)}"
          alt="${escapeHtml(
            caption || "Article image"
          )}"
          loading="lazy"
        />

        ${
          caption
            ? `<figcaption>${caption}</figcaption>`
            : ""
        }
      </figure>
    `;
  },

  table: (block) => {
    const rows = block.data?.content || [];

    if (!rows.length) return "";

    const [head, ...body] = rows;

    const hasHeadings =
      Boolean(block.data?.withHeadings) &&
      Array.isArray(head);

    const headHtml = hasHeadings
      ? `
        <thead>
          <tr>
            ${head
              .map(
                (cell) =>
                  `<th scope="col">${cell}</th>`
              )
              .join("")}
          </tr>
        </thead>
      `
      : "";

    const bodyRows = hasHeadings ? body : rows;

    const bodyHtml = `
      <tbody>
        ${bodyRows
          .map(
            (row) => `
              <tr>
                ${row
                  .map(
                    (cell) =>
                      `<td>${cell}</td>`
                  )
                  .join("")}
              </tr>
            `
          )
          .join("")}
      </tbody>
    `;

    return `
      <div class="editor-table-wrap">
        <table class="editor-table">
          ${headHtml}
          ${bodyHtml}
        </table>
      </div>
    `;
  },

  linkTool: (block) => {
    const meta = block.data?.meta || {};
    const link = block.data?.link || "#";

    return `
      <a
        class="editor-linktool"
        href="${escapeHtml(link)}"
        target="_blank"
        rel="noopener noreferrer"
      >
        <div class="editor-linktool-content">

          ${
            meta.title
              ? `<strong>${meta.title}</strong>`
              : ""
          }

          ${
            meta.description
              ? `<p>${meta.description}</p>`
              : ""
          }

          <span class="editor-linktool-url">
            ${escapeHtml(link)}
          </span>

        </div>

        ${
          meta.image?.url
            ? `
              <img
                src="${escapeHtml(meta.image.url)}"
                alt=""
                loading="lazy"
              />
            `
            : ""
        }
      </a>
    `;
  },

  embed: (block) => `
    <div class="editor-embed">

      <iframe
        src="${escapeHtml(block.data?.embed || "")}"
        title="${escapeHtml(
          block.data?.caption || "Embedded content"
        )}"
        loading="lazy"
        allowfullscreen
      ></iframe>

      ${
        block.data?.caption
          ? `
            <p class="editor-embed-caption">
              ${block.data.caption}
            </p>
          `
          : ""
      }

    </div>
  `,

  // IMPORTANT:
  // Raw HTML is sanitized before rendering.
  raw: (block) =>
    DOMPurify.sanitize(block.data?.html || ""),
};

const edjsParser = edjsHTML(customParsers);

/* -------------------------------------------------------
   Component
------------------------------------------------------- */

export default function BlogPostReader() {
  const { slug } = useParams();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const api =
    process.env.REACT_APP_API_END_POINT || "";

  const siteUrl = "https://hirenray.rest";

  const currentUrl = `${siteUrl}/blog/${encodeURIComponent(
    slug || ""
  )}`;

  /* -----------------------------------------------------
     Scroll progress
  ----------------------------------------------------- */

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight =
        document.documentElement.scrollHeight -
        window.innerHeight;

      if (totalHeight <= 0) {
        setScrollProgress(0);
        return;
      }

      const progress =
        (window.scrollY / totalHeight) * 100;

      setScrollProgress(
        Math.min(100, Math.max(0, progress))
      );
    };

    window.addEventListener(
      "scroll",
      handleScroll,
      { passive: true }
    );

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );
    };
  }, []);

  /* -----------------------------------------------------
     Fetch blog
  ----------------------------------------------------- */

  useEffect(() => {
    if (!slug) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    async function loadBlog() {
      try {
        setLoading(true);
        setNotFound(false);
        setBlog(null);

        const response = await fetch(
          `${api}/api/blogs/${encodeURIComponent(slug)}`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
            },
            signal: controller.signal,
          }
        );

        if (response.status === 404) {
          setNotFound(true);
          return;
        }

        if (!response.ok) {
          throw new Error(
            `API error: ${response.status}`
          );
        }

        const data = await response.json();

        if (!data || typeof data !== "object") {
          throw new Error("Invalid blog response");
        }

        setBlog(data);
      } catch (error) {
        if (error.name === "AbortError") {
          return;
        }

        console.error(
          "Failed to load blog:",
          error
        );

        setNotFound(true);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadBlog();

    return () => {
      controller.abort();
    };
  }, [slug, api]);

  /* -----------------------------------------------------
     Editor.js content
  ----------------------------------------------------- */

  const rawContent = useMemo(() => {
    if (!blog?.content) return null;

    if (typeof blog.content === "string") {
      try {
        return JSON.parse(blog.content);
      } catch (error) {
        console.error(
          "Invalid Editor.js JSON:",
          error
        );

        return null;
      }
    }

    return blog.content;
  }, [blog]);

  /* -----------------------------------------------------
     Full article text
  ----------------------------------------------------- */

  const fullText = useMemo(() => {
    if (
      !rawContent?.blocks ||
      !Array.isArray(rawContent.blocks)
    ) {
      return "";
    }

    return rawContent.blocks
      .map((block) => {
        if (block.data?.text) {
          return stripTags(
            block.data.text
          );
        }

        if (Array.isArray(block.data?.items)) {
          return block.data.items
            .map((item) =>
              typeof item === "string"
                ? stripTags(item)
                : stripTags(
                    item?.text ||
                      item?.content ||
                      ""
                  )
            )
            .join(" ");
        }

        if (block.data?.message) {
          return stripTags(
            block.data.message
          );
        }

        if (block.data?.caption) {
          return stripTags(
            block.data.caption
          );
        }

        return "";
      })
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();
  }, [rawContent]);

  /* -----------------------------------------------------
     Read time
  ----------------------------------------------------- */

  const wordCount = useMemo(() => {
    return fullText
      ? fullText.split(/\s+/).filter(Boolean).length
      : 0;
  }, [fullText]);

  const readTime = useMemo(() => {
    return `${Math.max(
      1,
      Math.ceil(wordCount / 200)
    )} min read`;
  }, [wordCount]);

  /* -----------------------------------------------------
     First paragraph
  ----------------------------------------------------- */

  const firstParagraph = useMemo(() => {
    if (
      !rawContent?.blocks ||
      !Array.isArray(rawContent.blocks)
    ) {
      return "";
    }

    const paragraph =
      rawContent.blocks.find(
        (block) =>
          block.type === "paragraph"
      );

    return paragraph
      ? stripTags(
          paragraph.data?.text || ""
        )
      : "";
  }, [rawContent]);

  /* -----------------------------------------------------
     Render Editor.js blocks
  ----------------------------------------------------- */

  const parsedBlocks = useMemo(() => {
    if (
      !rawContent ||
      !Array.isArray(rawContent.blocks)
    ) {
      return [];
    }

    return rawContent.blocks
      .map((block, index) => {
        try {
          const parser =
            customParsers[block.type];

          if (parser) {
            return parser(block);
          }

          const result =
            edjsParser.parse({
              blocks: [block],
            });

          return Array.isArray(result)
            ? result[0]
            : "";
        } catch (error) {
          console.error(
            `Failed to render block #${index}`,
            error
          );

          return "";
        }
      })
      .filter(Boolean);
  }, [rawContent]);

  /* -----------------------------------------------------
     Share
  ----------------------------------------------------- */

  const handleShare = (platform) => {
    const url = window.location.href;

    const text = `Check out this article by Hiren Ray: ${
      blog?.blog_title || ""
    }`;

    if (platform === "twitter") {
      window.open(
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(
          text
        )}&url=${encodeURIComponent(url)}`,
        "_blank",
        "noopener,noreferrer"
      );
    }

    if (platform === "linkedin") {
      window.open(
        `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
          url
        )}`,
        "_blank",
        "noopener,noreferrer"
      );
    }

    if (platform === "copy") {
      navigator.clipboard
        ?.writeText(url)
        .then(() => {
          alert("Link copied!");
        })
        .catch(() => {
          alert("Unable to copy link.");
        });
    }
  };

  /* -----------------------------------------------------
     Loading
     
     IMPORTANT:
     Do NOT put noindex here.
     Prerender.io needs time to reach the actual article.
  ----------------------------------------------------- */

  if (loading) {
    return (
      <div
        className="reader-state"
        aria-busy="true"
      >
        <span className="loader"></span>
      </div>
    );
  }

  /* -----------------------------------------------------
     404
  ----------------------------------------------------- */

  if (!blog || notFound) {
    return (
      <div className="reader-state">
        <Helmet>
          <title>
            Post not found | Hiren Ray
          </title>

          <meta
            name="robots"
            content="noindex, follow"
          />
        </Helmet>

        <p>Post not found.</p>

        <Link
          to="/blog"
          className="back-link"
        >
          ← Return to Blog
        </Link>
      </div>
    );
  }

  /* -----------------------------------------------------
     SEO values
  ----------------------------------------------------- */

  const title =
    blog.blog_title || "Hiren Ray Blog";

  const description =
    blog.blog_description ||
    firstParagraph ||
    `Read ${title} on Hiren Ray's blog.`;

  const publishedDate =
    blog.createdAt ||
    blog.createAt ||
    undefined;

  const modifiedDate =
    blog.updatedAt ||
    publishedDate ||
    undefined;

  const imageUrl =
    blog.imageUrl || undefined;

  /* -----------------------------------------------------
     BlogPosting schema
  ----------------------------------------------------- */

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",

    "@id": `${currentUrl}#blogposting`,

    headline: title,

    description,

    url: currentUrl,

    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": currentUrl,
    },

    ...(imageUrl
      ? {
          image: [imageUrl],
        }
      : {}),

    ...(publishedDate
      ? {
          datePublished: publishedDate,
        }
      : {}),

    ...(modifiedDate
      ? {
          dateModified: modifiedDate,
        }
      : {}),

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

    articleBody: fullText,

    wordCount,
  };

  /* -----------------------------------------------------
     Breadcrumb schema
  ----------------------------------------------------- */

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",

    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteUrl,
      },

      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: `${siteUrl}/blog`,
      },

      {
        "@type": "ListItem",
        position: 3,
        name: title,
        item: currentUrl,
      },
    ],
  };

  /* -----------------------------------------------------
     Render
  ----------------------------------------------------- */

  return (
    <div className="blog-reader-page">

      <Helmet>

        <html lang="en" />

        <title>
          {title} | Hiren Ray
        </title>

        <meta
          name="description"
          content={description}
        />

        <meta
          name="robots"
          content="index, follow"
        />

        <link
          rel="canonical"
          href={currentUrl}
        />

        {/* Open Graph */}

        <meta
          property="og:type"
          content="article"
        />

        <meta
          property="og:title"
          content={title}
        />

        <meta
          property="og:description"
          content={description}
        />

        <meta
          property="og:url"
          content={currentUrl}
        />

        {imageUrl && (
          <>
            <meta
              property="og:image"
              content={imageUrl}
            />

            <meta
              property="og:image:alt"
              content={title}
            />
          </>
        )}

        {/* Twitter */}

        <meta
          name="twitter:card"
          content="summary_large_image"
        />

        <meta
          name="twitter:title"
          content={title}
        />

        <meta
          name="twitter:description"
          content={description}
        />

        {imageUrl && (
          <meta
            name="twitter:image"
            content={imageUrl}
          />
        )}

        {/* Article */}

        {publishedDate && (
          <meta
            property="article:published_time"
            content={publishedDate}
          />
        )}

        {modifiedDate && (
          <meta
            property="article:modified_time"
            content={modifiedDate}
          />
        )}

        <script type="application/ld+json">
          {JSON.stringify(schemaData)}
        </script>

        <script type="application/ld+json">
          {JSON.stringify(
            breadcrumbSchema
          )}
        </script>

      </Helmet>

      {/* Reading progress */}

      <div
        className="scroll-progress-bar"
        style={{
          width: `${scrollProgress}%`,
        }}
        aria-hidden="true"
      />

      <main className="reader-container">

        {/* Breadcrumb */}

        <nav
          className="reader-nav"
          aria-label="Breadcrumb"
        >
          <ol className="breadcrumb-list">

            <li>
              <Link to="/">
                Home
              </Link>
            </li>

            <li>
              <span>/</span>
            </li>

            <li>
              <Link to="/blog">
                Blog
              </Link>
            </li>

            <li>
              <span>/</span>
            </li>

            <li aria-current="page">
              {title}
            </li>

          </ol>
        </nav>

        {/* Header */}

        <header className="reader-header">

          <div className="meta-bar">

            {publishedDate && (
              <>
                <time
                  className="reader-date"
                  dateTime={publishedDate}
                >
                  {formatDate(
                    publishedDate
                  )}
                </time>

                <span className="dot">
                  •
                </span>
              </>
            )}

            <span className="read-time">
              {readTime}
            </span>

          </div>

          <h1 className="reader-title">
            {title}
          </h1>

          {blog.blog_description && (
            <p className="reader-subtitle">
              {blog.blog_description}
            </p>
          )}

          {/* Author */}

          <div className="author-share-bar">

            <div className="author-info">

              <div
                className="author-avatar"
                aria-hidden="true"
              >
                HR
              </div>

              <div className="author-meta">

                <span className="author-name">
                  Hiren Ray
                </span>

                <span className="author-role">
                  Full Stack Engineer
                </span>

              </div>

            </div>

            <div className="share-actions">

              <button
                type="button"
                onClick={() =>
                  handleShare(
                    "twitter"
                  )
                }
                aria-label="Share on X"
              >
                X
              </button>

              <button
                type="button"
                onClick={() =>
                  handleShare(
                    "linkedin"
                  )
                }
                aria-label="Share on LinkedIn"
              >
                in
              </button>

              <button
                type="button"
                onClick={() =>
                  handleShare("copy")
                }
                aria-label="Copy article URL"
              >
                🔗
              </button>

            </div>

          </div>

        </header>

        {/* Cover image */}

        {imageUrl && (
          <div className="reader-cover-wrapper">

            <img
              src={imageUrl}
              alt={title}
              className="reader-cover-image"
              loading="eager"
              fetchPriority="high"
            />

          </div>
        )}

        {/* Article */}

        <article className="reader-body">

          {parsedBlocks.map(
            (htmlString, index) => (
              <div
                key={`block-${index}`}
                dangerouslySetInnerHTML={{
                  __html:
                    DOMPurify.sanitize(
                      htmlString
                    ),
                }}
              />
            )
          )}

        </article>

        {/* Footer */}

        <footer className="reader-footer">

          <div className="footer-share">

            <span>
              Share this article:
            </span>

            <div className="share-actions">

              <button
                type="button"
                onClick={() =>
                  handleShare(
                    "twitter"
                  )
                }
              >
                Twitter
              </button>

              <button
                type="button"
                onClick={() =>
                  handleShare(
                    "linkedin"
                  )
                }
              >
                LinkedIn
              </button>

              <button
                type="button"
                onClick={() =>
                  handleShare("copy")
                }
              >
                Copy Link
              </button>

            </div>

          </div>

          <div className="footer-navigation">

            <Link
              to="/blog"
              className="back-to-index"
            >
              ← Back to all articles
            </Link>

          </div>

        </footer>

      </main>

    </div>
  );
}