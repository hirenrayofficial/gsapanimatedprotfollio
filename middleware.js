// middleware.js

export const config = {
  matcher:
    "/((?!static|api|favicon.ico|manifest.json|logo192.png|logo512.png|sitemap.xml|robots.txt).*)",
};

const CRAWLER_UA_REGEX =
  /bot|googlebot|crawler|spider|crawling|bingbot|yandex|baiduspider|facebookexternalhit|twitterbot|rogerbot|linkedinbot|embedly|quora link preview|showyoubot|outbrain|pinterest\/0\.|slackbot|vkshare|w3c_validator|redditbot|applebot|whatsapp|flipboard|tumblr|bitlybot|skypeuripreview|nuzzel|discordbot|telegrambot|gptbot|oai-searchbot|claudebot|ccbot|perplexitybot|chrome-lighthouse/i;

export default async function middleware(request) {
  const ua = request.headers.get("user-agent") || "";

  // Normal users -> React CSR
  if (!CRAWLER_UA_REGEX.test(ua)) {
    return;
  }

  try {
    // Send the complete original URL to Prerender.io
    const prerenderUrl = `https://service.prerender.io/${request.url}`;

    const prerenderRes = await fetch(prerenderUrl, {
      headers: {
        "X-Prerender-Token": process.env.PRERENDER_TOKEN,
        "User-Agent": ua,
      },
    });

    if (!prerenderRes.ok) {
      return;
    }

    const html = await prerenderRes.text();

    return new Response(html, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "public, max-age=300",
      },
    });
  } catch (error) {
    console.error("Prerender error:", error);

    // If prerender fails, let the normal React app handle the request
    return;
  }
}