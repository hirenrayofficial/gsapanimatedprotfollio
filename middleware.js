// middleware.js

export const config = {
  matcher: "/((?!static|api|favicon.ico|manifest.json|logo192.png|logo512.png|sitemap.xml|robots.txt).*)",
};

const CRAWLER_UA_REGEX =
  /bot|googlebot|crawler|spider|crawling|bingbot|yandex|baiduspider|facebookexternalhit|twitterbot|rogerbot|linkedinbot|embedly|quora link preview|showyoubot|outbrain|pinterest\/0\.|slackbot|vkshare|w3c_validator|redditbot|applebot|whatsapp|flipboard|tumblr|bitlybot|skypeuripreview|nuzzel|discordbot|telegrambot|gptbot|oai-searchbot|claudebot|ccbot|perplexitybot|chrome-lighthouse/i;

export default async function middleware(request) {
  const ua = request.headers.get("user-agent") || "";

  if (!CRAWLER_UA_REGEX.test(ua)) {
    return; // real users -> normal CSR app, untouched
  }

  const url = new URL(request.url);
  const prerenderUrl = `https://service.prerender.io${url.pathname}${url.search}`;

  const prerenderRes = await fetch(prerenderUrl, {
    headers: {
      "X-Prerender-Token": process.env.PRERENDER_TOKEN,
      "User-Agent": ua,
    },
  });

  const html = await prerenderRes.text();

  return new Response(html, {
    status: prerenderRes.status,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}