export default function Footer() {
  return (
    <footer className="border-t mt-12 py-6 bg-news-white">
      <div className="max-w-6xl mx-auto px-4 text-sm text-gray-600">
        © {new Date().getFullYear()} The Register — A modern news portal
        prototype.
      </div>
    </footer>
  );
}
