import { useEffect, useState } from "react";

export default function BreakingTicker() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    let mounted = true;
    async function fetchTicker() {
      try {
        const res = await fetch("/api/news?pageSize=5");
        const json = await res.json();
        if (mounted)
          setItems(json.articles?.slice(0, 5).map((a) => a.title) || []);
      } catch (e) {}
    }
    fetchTicker();
    const id = setInterval(fetchTicker, 30000);
    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, []);

  if (!items.length) return null;
  return (
    <div className="breaking text-white py-2">
      <div className="max-w-6xl mx-auto px-4 flex items-center gap-4">
        <div className="font-bold px-3">BREAKING</div>
        <div className="overflow-hidden whitespace-nowrap">
          <div className="animate-marquee inline-block">
            {items.join(" • ")}
          </div>
        </div>
      </div>
      <style jsx>{`
        .animate-marquee {
          animation: marquee 18s linear infinite;
        }
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}
