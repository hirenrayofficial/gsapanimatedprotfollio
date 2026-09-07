import fs from 'fs';
import path from 'path';

async function generateSitemap() {
  const baseUrl = 'https://hirenray.rest';
  const api = process.env.REACT_APP_API_END_POINT

  // Fetch your blog posts
  const response = await fetch(api + '/api/blogs');
  const posts = await response.json();

  const dynamicUrls = posts
    .map(
      (post) => `
    <url>
      <loc>${baseUrl}/blog/${post.slug}</loc>
      <lastmod>${post.updatedAt || new Date().toISOString()}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.8</priority>
    </url>`
    )
    .join('');

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemapindex.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
    <url>
    <loc>${baseUrl}/blog</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
    <url>
    <loc>${baseUrl}/about</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
    <url>
    <loc>${baseUrl}/contact</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
    <url>
    <loc>${baseUrl}/privacy</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>${dynamicUrls}
</urlset>`;

  const outputPath = path.resolve(process.cwd(), 'public', 'sitemap.xml');
  fs.writeFileSync(outputPath, sitemapXml);
  console.log('Sitemap generated successfully!');
}

generateSitemap();