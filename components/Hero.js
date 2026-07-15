import { formatRelativeOrClock } from "../utils/time";

export default function Hero({ article }) {
  if (!article) return null;
  return (
    <article className="grid lg:grid-cols-3 gap-6 items-center">
      <div className="lg:col-span-2">
        <a href={article.url} className="block">
          <h1 className="text-4xl font-serif leading-tight">{article.title}</h1>
          <p className="mt-2 text-gray-700">{article.description}</p>
        </a>
        <div className="mt-3 text-sm text-gray-600">
          {formatRelativeOrClock(article.publishedAt)}
        </div>
      </div>
      <div className="aspect-video bg-gray-200 rounded overflow-hidden">
        <img
          src={article.urlToImage || "/placeholder.jpg"}
          alt="hero"
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
    </article>
  );
}
