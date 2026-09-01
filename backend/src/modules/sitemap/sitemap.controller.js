import prisma from '../../config/db.js';

let cachedSitemapXml = null;
let lastCacheTime = 0;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes cache

const escapeXml = (unsafe) => {
  if (!unsafe) return '';
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
};

export const getSitemapXml = async (req, res, next) => {
  try {
    const now = Date.now();
    if (cachedSitemapXml && (now - lastCacheTime < CACHE_TTL_MS)) {
      res.header('Content-Type', 'application/xml; charset=utf-8');
      return res.status(200).send(cachedSitemapXml);
    }

    const baseUrl = (process.env.FRONTEND_URL || 'https://suranghinaar.com').replace(/\/$/, '');

    // 1. Fetch categories and active products from database
    const [categories, products] = await Promise.all([
      prisma.category.findMany({ select: { slug: true } }),
      prisma.product.findMany({
        where: { isSoldOut: false },
        select: { id: true, updatedAt: true }
      })
    ]);

    // 2. Define static public pages
    const staticPages = [
      { path: '/', priority: '1.0', changefreq: 'daily' },
      { path: '/about', priority: '0.5', changefreq: 'monthly' },
      { path: '/contact', priority: '0.5', changefreq: 'monthly' },
      { path: '/privacy-policy', priority: '0.3', changefreq: 'yearly' },
      { path: '/refund-exchange-policy', priority: '0.3', changefreq: 'yearly' },
      { path: '/disclaimer', priority: '0.3', changefreq: 'yearly' }
    ];

    const todayIso = new Date().toISOString().split('T')[0];

    // Build XML URL entries
    let xmlUrls = '';

    // Static pages
    for (const page of staticPages) {
      xmlUrls += `  <url>\n    <loc>${baseUrl}${page.path}</loc>\n    <lastmod>${todayIso}</lastmod>\n    <changefreq>${page.changefreq}</changefreq>\n    <priority>${page.priority}</priority>\n  </url>\n`;
    }

    // Category pages
    for (const cat of categories) {
      xmlUrls += `  <url>\n    <loc>${baseUrl}/category/${escapeXml(cat.slug)}</loc>\n    <lastmod>${todayIso}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
    }

    // Product pages
    for (const prod of products) {
      const lastmod = prod.updatedAt
        ? new Date(prod.updatedAt).toISOString().split('T')[0]
        : todayIso;

      xmlUrls += `  <url>\n    <loc>${baseUrl}/product/${escapeXml(prod.id)}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;
    }

    const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${xmlUrls}</urlset>`;

    cachedSitemapXml = xmlContent.trim();
    lastCacheTime = now;

    res.header('Content-Type', 'application/xml; charset=utf-8');
    return res.status(200).send(cachedSitemapXml);
  } catch (error) {
    next(error);
  }
};
