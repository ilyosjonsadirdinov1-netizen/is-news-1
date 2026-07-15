import Navbar from "../components/Navbar";
import BreakingTicker from "../components/BreakingTicker";
import Hero from "../components/Hero";
import CategoryList from "../components/CategoryList";
import ArticleCard from "../components/ArticleCard";
import Footer from "../components/Footer";
import { formatRelativeOrClock } from "../utils/time";
import { useEffect, useState } from "react";

export default function Home({ topArticle, categories, latest }) {
  const [clientLatest, setClientLatest] = useState(latest || []);

  useEffect(() => {
    let mounted = true;
    async function fetchLatest() {
      try {
        const res = await fetch("/api/news?pageSize=8");
        const json = await res.json();
        if (!mounted) return;
        setClientLatest(json.articles || []);
      } catch (e) {
        // ignore
      }
    }

    // initial fetch (in case SSR props are stale) and poll using NEXT_PUBLIC_POLL_INTERVAL
    fetchLatest();
    const clientInterval = parseInt(
      process.env.NEXT_PUBLIC_POLL_INTERVAL || "30000",
      10,
    );
    const id = setInterval(fetchLatest, clientInterval);
    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, []);

  const listSource = clientLatest.length ? clientLatest : latest;

  return (
    <div className="min-h-screen bg-news-white text-gray-900">
      <Navbar />
      <BreakingTicker />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <Hero article={topArticle} />

        <section className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-serif mb-4">Latest</h2>
            <div className="space-y-6">
              {listSource.map((a) => (
                <ArticleCard key={a.url} article={a} />
              ))}
            </div>
          </div>
          <aside>
            <h3 className="text-xl font-serif mb-3">Categories</h3>
            <CategoryList categories={categories} />

            <div className="mt-8">
              <h4 className="text-lg font-serif mb-2">Editor's pick</h4>
              {listSource.slice(0, 3).map((a) => (
                <div key={a.url} className="py-2 border-b">
                  <div className="text-sm text-gray-600">
                    {formatRelativeOrClock(a.publishedAt)}
                  </div>
                  <a href={a.url} className="font-medium hover:underline">
                    {a.title}
                  </a>
                </div>
              ))}
            </div>
          </aside>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export async function getStaticProps() {
  const API_KEY = process.env.NEWSAPI_KEY || "";
  const fetchFromNewsAPI = async (params) => {
    const url = new URL("https://newsapi.org/v2/top-headlines");
    url.search = new URLSearchParams({
      country: "us",
      pageSize: "10",
      ...params,
    });
    const res = await fetch(url.toString(), {
      headers: { "X-Api-Key": API_KEY },
    });
    const json = await res.json();
    return json.articles || [];
  };

  const [top] = await fetchFromNewsAPI({ pageSize: "1" });
  const latest = await fetchFromNewsAPI({ pageSize: "8" });
  const categories = ["Politics", "Economy", "Technology", "World", "Society"];

  return { props: { topArticle: top || null, latest, categories } };
}
