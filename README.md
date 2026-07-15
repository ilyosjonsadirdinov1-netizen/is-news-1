# News Portal (Next.js + Tailwind)

Quick starter for a modern editorial News Portal with a breaking news ticker, hero, categories, and an admin page that can integrate with NewsAPI.

Setup

1. Install dependencies

```bash
npm install
```

2. Development

```bash
npm run dev
```

3. Environment

Create `.env.local` with `NEWSAPI_KEY=your_key_here` to enable real API fetches. Admin can also pass `apikey` query param to `/api/news` during testing.

For Google sign-in, add the following to `.env.local`:

```bash
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=a_random_secret_value
```

Then run the app and click the `Sign in with Google` button in the top navbar.

Optional Redis background caching (recommended for higher traffic)

- Set `REDIS_URL` in your environment and run the background worker to pre-populate cache:

```powershell
# example .env.local additions
REDIS_URL=redis://localhost:6379
NEWSAPI_KEY=your_key_here

# install new dependency (ioredis) if not installed
npm install ioredis node-fetch

# start worker to refresh cache every minute
REDIS_URL=redis://localhost:6379 NEWSAPI_KEY=your_key_here WORKER_INTERVAL=60 node scripts/fetchCache.js
```

API & Polling notes

- The API route `pages/api/news.js` will use Redis when `REDIS_URL` is set, otherwise it falls back to an in-memory cache.
- Client polling interval is configurable with `NEXT_PUBLIC_POLL_INTERVAL` (milliseconds). Default is `30000` (30s).

Files of interest

- `pages/index.js` - homepage with hero, ticker and categories
- `pages/admin.js` - admin/test panel for NewsAPI
- `pages/api/news.js` - server API with caching and NewsAPI integration
- `components/` - reusable UI components

Performance notes

- Use `next build` and deploy to Vercel/Cloudfront for CDN and edge caching.
- Increase caching headers in `pages/api/news.js` for production scale.
