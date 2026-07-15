import { useState } from "react";
import Navbar from "../components/Navbar";

export default function Admin() {
  const [apikey, setApikey] = useState("");
  const [status, setStatus] = useState("");

  async function testFetch() {
    setStatus("fetching");
    try {
      const res = await fetch(
        `/api/news?apikey=${encodeURIComponent(apikey)}&pageSize=5`,
      );
      const data = await res.json();
      setStatus(`OK: ${data.articles?.length || 0} articles`);
    } catch (e) {
      setStatus("Error: " + e.message);
    }
  }

  return (
    <div>
      <Navbar />
      <main className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-serif">Admin / NewsAPI Tester</h1>
        <p className="mt-2 text-sm text-gray-600">
          Enter a NewsAPI key to test live fetches. Keys are not stored
          server-side here.
        </p>

        <div className="mt-4">
          <label className="block text-sm font-medium">NewsAPI Key</label>
          <input
            className="mt-1 w-full border p-2"
            value={apikey}
            onChange={(e) => setApikey(e.target.value)}
          />
        </div>

        <div className="mt-4 flex gap-2">
          <button
            className="px-4 py-2 bg-deep-blue text-white"
            onClick={testFetch}
          >
            Test Fetch
          </button>
          <div className="py-2 px-3">{status}</div>
        </div>
      </main>
    </div>
  );
}
