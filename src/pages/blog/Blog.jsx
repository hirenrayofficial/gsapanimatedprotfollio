import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import BlogView from "../../blog/component/BlogView";

export default function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const api = process.env.REACT_APP_API_END_POINT || "";

  const pageUrl = `https://hirenray.rest/blog`;


  useEffect(() => {
    setLoading(true);
    fetch(`${api}/api/blogs`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch blogs.");
        }
        return res.json();
      })
      .then((data) => {
        const blogList = Array.isArray(data) ? data : data.blogs || [];
        setBlogs(blogList);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching blogs:", err);
        setError(err.message);
        setLoading(false);
      });
  }, [api]);

  return (
    <>
      <Helmet>
        <html lang="en" />
        <title>Blog & Insights | Hiren Ray - Full Stack Engineer</title>
        <meta
          name="description"
          content="Explore software engineering articles, technical insights, and web development thoughts by Hiren Ray."
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={pageUrl} />

        <meta property="og:type" content="website" />
        <meta property="og:title" content="Blog & Insights | Hiren Ray" />
        <meta
          property="og:description"
          content="Explore software engineering articles, technical insights, and web development thoughts by Hiren Ray."
        />
        <meta property="og:url" content={pageUrl} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Blog & Insights | Hiren Ray" />
        <meta
          name="twitter:description"
          content="Explore software engineering articles, technical insights, and web development thoughts by Hiren Ray."
        />
        
      </Helmet>

      {loading ? (
        <main className="blog-container" style={{ textAlign: "center", padding: "3rem" }}>
          <p>Loading blogs...</p>
        </main>
      ) : error ? (
        <main className="blog-container" style={{ textAlign: "center", padding: "3rem", color: "#e53e3e" }}>
          <p>Failed to load blogs: {error}</p>
        </main>
      ) : (
        <BlogView blog={blogs} />
      )}
    </>
  );
}