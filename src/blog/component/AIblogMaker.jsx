import React, { useState, useRef, useEffect } from "react";
import { Sparkles, Copy, Check, RefreshCw, Terminal, CornerDownLeft, CheckCircle2, AlertCircle } from "lucide-react";
import "../style/aiblogmaker.scss";

export default function AIblogMaker() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState(null); // Tracks success/error status messages
  const textareaRef = useRef(null);

  // Auto-expand textarea height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [prompt]);

  // Handle API Fetch Execution
  const handleFetchAI = async (e) => {
    e?.preventDefault();
    if (!prompt.trim() || isLoading) return;

    setIsLoading(true);
    setResponse("");
    setStatus(null); // Reset previous status

    try {
      const res = await fetch("https://api.hrblog.hirenray.rest/api/blogs/AIBlogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fprompt: prompt }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus({ type: "success", message: "Blog generated successfully!" });
        setResponse(data.result || data.message || JSON.stringify(data, null, 2));
      } else {
        setStatus({ type: "error", message: data.message || "Failed to generate blog." });
      }
    } catch (error) {
      console.error("API Error:", error);
      setStatus({ type: "error", message: "An error occurred while connecting to the AI service." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!response) return;
    navigator.clipboard.writeText(response);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      handleFetchAI(e);
    }
  };

  return (
    <div className="ai-workbench">
      {/* Top Navigation */}
      <header className="ai-workbench__header">
        <div className="brand">
          <div className="status-dot" />
          <span className="title">Engine // Core</span>
        </div>
        <div className="meta">
          <span>Ctrl + Enter to send</span>
          <span className="badge">v1.0.0</span>
        </div>
      </header>

      {/* Main Container */}
      <main className="ai-workbench__main">
        {/* Input Form */}
        <section className="ai-workbench__form-card">
          <form onSubmit={handleFetchAI}>
            <div className="form-header">
              <Terminal size={14} />
              <span>prompt.input</span>
            </div>

            <textarea
              ref={textareaRef}
              rows={2}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything or request system code..."
              className="prompt-textarea"
            />

            <div className="form-footer">
              <span className="char-count">{prompt.length} chars</span>

              <button
                type="submit"
                disabled={!prompt.trim() || isLoading}
                className="execute-btn"
              >
                {isLoading ? (
                  <>
                    <RefreshCw size={14} className="spin" />
                    <span>Processing</span>
                  </>
                ) : (
                  <>
                    <span>Execute</span>
                    <CornerDownLeft size={12} />
                  </>
                )}
              </button>
            </div>
          </form>
        </section>

        {/* Status Notification Banner */}
        {status && (
          <div className={`status-banner ${status.type}`}>
            {status.type === "success" ? (
              <CheckCircle2 size={16} />
            ) : (
              <AlertCircle size={16} />
            )}
            <span>{status.message}</span>
          </div>
        )}

        {/* Output Section */}
        <section className="ai-workbench__output">
          {isLoading && (
            <div className="loading-state">
              <Sparkles size={20} className="spin" />
              <p>Fetching response vectors...</p>
            </div>
          )}

          {!isLoading && response && (
            <div className="response-card">
              <div className="response-header">
                <div className="status">
                  <div className="dot" />
                  <span>ai.response</span>
                </div>

                <button
                  onClick={handleCopy}
                  className={`copy-btn ${copied ? "copied" : ""}`}
                >
                  {copied ? (
                    <>
                      <Check size={12} />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy size={12} />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              <div className="response-body">{response}</div>
            </div>
          )}

          {!isLoading && !response && (
            <div className="empty-state">
              <Terminal size={20} color="#a3a3a3" />
              <p>System idle. Send a prompt to execute response stream.</p>
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="ai-workbench__footer">
        Minimalist AI Workspace &bull; SCSS + React
      </footer>
    </div>
  );
}