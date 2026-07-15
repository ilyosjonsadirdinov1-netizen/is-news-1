// Background worker to populate Redis cache for news endpoints.
// Usage: REDIS_URL=... NEWSAPI_KEY=... node scripts/fetchCache.js
const fetch = require("node-fetch");
const Redis = (() => {
  try {
    return require("ioredis");
  } catch (e) {
    return null;
  }
})();

const REDIS_URL = process.env.REDIS_URL;
const API_KEY = process.env.NEWSAPI_KEY;
const INTERVAL = parseInt(process.env.WORKER_INTERVAL || "60", 10) * 1000;

if (!REDIS_URL || !API_KEY) {
  console.error("REDIS_URL and NEWSAPI_KEY must be set to run worker");
  process.exit(1);
}

const client = new Redis(REDIS_URL);

async function fetchAndCache() {
  try {
    const params = new URLSearchParams({ country: "us", pageSize: "20" });
    const url = `https://newsapi.org/v2/top-headlines?${params.toString()}`;
    const res = await fetch(url, { headers: { "X-Api-Key": API_KEY } });
    const json = await res.json();
    const key = `news:top:us:all:20`;
    await client.set(
      key,
      JSON.stringify(json),
      "EX",
      Math.max(60, INTERVAL / 1000),
    );
    console.log(new Date().toISOString(), "cached", key);
  } catch (e) {
    console.error("fetch/cache error", e.message);
  }
}

async function main() {
  await fetchAndCache();
  setInterval(fetchAndCache, INTERVAL);
}

main();
