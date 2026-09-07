import React, { useState } from 'react';
import styles from './Contact.module.scss';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className={styles.contactWrapper}>
      <div className={styles.container}>
        {/* Header */}
        <header className={styles.header}>
          <h1>Get in Touch</h1>
          <p>
            Have a question, feedback, or business inquiry? Leave a message below and I’ll respond as soon as possible.
          </p>
        </header>

        {/* Contact Card */}
        <div className={styles.cardGrid}>
          {/* Sidebar Info */}
          <aside className={styles.sidebar}>
            <div>
              <h2>Contact Info</h2>
              <p className={styles.sidebarText}>
                Feel free to reach out directly via email or use the contact form.
              </p>

              <div className={styles.infoGroup}>
                <div className={styles.infoItem}>
                  <h3>Email</h3>
                  <a href="mailto:contact@hirenray.rest">contact@hirenray.rest</a>
                </div>

                <div className={styles.infoItem}>
                  <h3>Location</h3>
                  <p>Siliguri, West Bengal, India</p>
                </div>

                <div className={styles.infoItem}>
                  <h3>Response Time</h3>
                  <p>Mon – Fri | 24–48 Hours</p>
                </div>
              </div>
            </div>

            <div className={styles.footerNote}>
              © {new Date().getFullYear()} Your Portfolio/Blog. All rights reserved.
            </div>
          </aside>

          {/* Form Area */}
          <main className={styles.formContainer}>
            {submitted ? (
              <div className={styles.successState}>
                <div className={styles.icon}>✓</div>
                <h3>Message Sent!</h3>
                <p>Thank you for reaching out. Your message has been received.</p>
                <button onClick={() => setSubmitted(false)}>
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className={styles.field}>
                  <label htmlFor="name">Your Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                  />
                </div>

                <div className={styles.field}>
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                  />
                </div>

                <div className={styles.field}>
                  <label htmlFor="subject">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Inquiry about..."
                  />
                </div>

                <div className={styles.field}>
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    rows="4"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Write your message here..."
                  ></textarea>
                </div>

                <button type="submit" className={styles.submitBtn}>
                  Send Message
                </button>
              </form>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}