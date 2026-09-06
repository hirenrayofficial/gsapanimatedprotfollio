import React, { useState, useEffect } from "react";
import BlogView from "../../blog/component/BlogView";

export default function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const api = process.env.REACT_APP_API_END_POINT || "";

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
        // Normalizes data whether returned as an array or { blogs: [...] } object
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

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "3rem" }}>
        <p>Loading blogs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", padding: "3rem", color: "#e53e3e" }}>
        <p>Failed to load blogs: {error}</p>
      </div>
    );
  }

  return (
    <div>
      <BlogView blog={blogs} />
    </div>
  );
}