import React from "react";
import Landing from "./Landing";
import PageSlider from "./commonUsePage/SliderPages";
import Cursor from "./commonUsePage/Cursor";

import TimelineScrolling from "./projects/TimelineScrolling";
import Project from "./projects/Project";
import { Helmet } from "react-helmet-async";

export default function Hero() {
  const siteUrl = "https://hirenray.rest";

  const schemaData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: `${siteUrl}/`,
        name: "Hiren Ray — Portfolio",
        description: "Portfolio of Hiren Ray — designer & developer",
        publisher: { "@id": `${siteUrl}/#person` },
      },
      {
        "@type": "Person",
        "@id": `${siteUrl}/#person`,
        name: "Hiren Ray",
        url: `${siteUrl}/`,
        sameAs: [
          "https://twitter.com/hirenray",
          "https://www.linkedin.com/in/hirenray",
        ],
      },
    ],
  };

  return (
    <div>
      <Helmet>
        <title>Hiren Ray — Portfolio</title>
        <meta
          name="description"
          content="Portfolio of Hiren Ray — designer & developer. Showcasing projects, case studies and contact details."
        />
        <meta
          name="keywords"
          content="Hiren Ray, portfolio, web developer, designer, frontend, GSAP, React"
        />
        <link rel="canonical" href={`${siteUrl}/`} />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Hiren Ray" />
        <link rel="alternate" href={`${siteUrl}/`} hreflang="en" />

        <meta property="og:locale" content="en_US" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Hiren Ray — Portfolio" />
        <meta
          property="og:description"
          content="Portfolio of Hiren Ray — designer & developer. Showcasing projects, case studies and contact details."
        />
        <meta property="og:url" content={`${siteUrl}/`} />
        <meta property="og:site_name" content="HirenRay.rest" />
        <meta property="og:image" content={`${siteUrl}/cardimg/og-image.png`} />
        <meta property="og:image:alt" content="Hiren Ray portfolio preview" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@hirenray" />
        <meta name="twitter:creator" content="@hirenray" />
        <meta name="twitter:title" content="Hiren Ray — Portfolio" />
        <meta
          name="twitter:description"
          content="Portfolio of Hiren Ray — designer & developer."
        />
        <meta
          name="twitter:image"
          content={`${siteUrl}/cardimg/og-image.png`}
        />

        <script type="application/ld+json">{JSON.stringify(schemaData)}</script>
      </Helmet>
      <Cursor />
      <Landing />
      <Project />
      <TimelineScrolling />
      <PageSlider />
    </div>
  );
}
