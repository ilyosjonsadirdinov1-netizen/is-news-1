/**
 * API proxy for NewsAPI with optional Redis backing.
 * Behavior:
 * - If `REDIS_URL` is provided, the endpoint will attempt to read/write cached results to Redis.
 * - If no Redis available, falls back to a simple in-memory cache.
 * - Accepts `apikey` query override for testing (admin).
 */
let memCache = { ts: 0, data: null };
const DEFAULT_TTL = parseInt(process.env.NEWSAPI_CACHE_TTL || "30", 10) * 1000;

let redisClient = null;
async function getRedis() {
  if (redisClient) return redisClient;
  const url = process.env.REDIS_URL;
  if (!url) return null;
  try {
    const Redis = require("ioredis");
    redisClient = new Redis(url);
    return redisClient;
  } catch (e) {
    console.warn("Redis client not available:", e.message);
    return null;
  }
}

export default async function handler(req, res) {
  const { query } = req;
  const apikey = query.apikey || process.env.NEWSAPI_KEY || "";
  if (!apikey) {
    return res.status(200).json({ articles: [] });
  }

  const pageSize = query.pageSize || "10";
  const country = query.country || "us";
  const category = query.category ? query.category.toLowerCase() : null;

  const cacheKey = `news:top:${country}:${category || "all"}:${pageSize}`;

  const redis = await getRedis();
  if (redis) {
    try {
      const cached = await redis.get(cacheKey);
      if (cached) {
        res.setHeader("x-cache", "REDIS");
        res.setHeader(
          "Cache-Control",
          "public, s-maxage=30, stale-while-revalidate=60",
        );
        return res.status(200).json(JSON.parse(cached));
      }
    } catch (e) {
      console.warn("Redis read failed", e.message);
    }
  } else {
    const now = Date.now();
    if (memCache.data && now - memCache.ts < DEFAULT_TTL) {
      res.setHeader("x-cache", "MEM");
      res.setHeader(
        "Cache-Control",
        `public, s-maxage=${DEFAULT_TTL / 1000}, stale-while-revalidate=60`,
      );
      return res.status(200).json(memCache.data);
    }
  }

  const params = new URLSearchParams();
  params.set("pageSize", pageSize);
  params.set("country", country);
  if (category) params.set("category", category);
  if (query.q) params.set("q", query.q);

  const url = `https://newsapi.org/v2/top-headlines?${params.toString()}`;
  try {
    const r = await fetch(url, { headers: { "X-Api-Key": apikey } });
    const json = await r.json();

    // store cache
    if (redis) {
      try {
        await redis.set(
          cacheKey,
          JSON.stringify(json),
          "EX",
          Math.max(30, DEFAULT_TTL / 1000),
        );
      } catch (e) {
        /* ignore */
      }
    } else {
      memCache = { ts: Date.now(), data: json };
    }

    res.setHeader(
      "Cache-Control",
      `public, s-maxage=${DEFAULT_TTL / 1000}, stale-while-revalidate=60`,
    );
    res.status(200).json(json);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
