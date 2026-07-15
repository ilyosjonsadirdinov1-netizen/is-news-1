import { formatRelativeOrClock } from "../utils/time";

export default function ArticleCard({ article }) {
  return (
    <article className="border-b py-4 flex gap-4">
      <div className="w-28 h-20 bg-gray-100 overflow-hidden">
        <img
          src={article.urlToImage || "/placeholder.jpg"}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="flex-1">
        <a href={article.url} className="text-lg font-medium hover:underline">
          {article.title}
        </a>
        <div className="text-sm text-gray-600">
          {article.source?.name} • {formatRelativeOrClock(article.publishedAt)}
        </div>
      </div>
    </article>
  );
}
