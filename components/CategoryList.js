import Link from "next/link";

export default function CategoryList({ categories = [] }) {
  return (
    <ul className="space-y-2">
      {categories.map((c) => (
        <li key={c}>
          <Link
            href={`/categories/${encodeURIComponent(c)}`}
            className="text-deep-blue hover:underline"
          >
            {c}
          </Link>
        </li>
      ))}
    </ul>
  );
}
