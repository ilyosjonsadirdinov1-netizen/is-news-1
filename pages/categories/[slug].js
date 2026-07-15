import Navbar from "../../components/Navbar";
import ArticleCard from "../../components/ArticleCard";

export default function CategoryPage({ articles, slug }) {
  return (
    <div>
      <Navbar />
      <main className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-serif">{slug}</h1>
        <div className="mt-6 space-y-4">
          {articles.map((a) => (
            <ArticleCard key={a.url} article={a} />
          ))}
        </div>
      </main>
    </div>
  );
}

export async function getStaticPaths() {
  const categories = ["politics", "economy", "technology", "world", "society"];
  return {
    paths: categories.map((cat) => ({ params: { slug: cat } })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const slug = params.slug;
  const API_KEY = process.env.NEWSAPI_KEY || "";
  const url = new URL("https://newsapi.org/v2/top-headlines");
  url.search = new URLSearchParams({
    category: slug.toLowerCase(),
    country: "us",
    pageSize: "20",
  });
  const res = await fetch(url.toString(), {
    headers: { "X-Api-Key": API_KEY },
  });
  const json = await res.json();
  return { props: { articles: json.articles || [], slug } };
}
