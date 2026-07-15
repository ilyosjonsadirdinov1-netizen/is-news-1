import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session, status } = useSession();

  return (
    <header className="bg-news-white border-b">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-serif text-dark-slate">
          The Register
        </Link>
        <div className="flex items-center gap-4">
          <nav className="hidden md:flex items-center gap-4">
            <Link href="/" className="hover:text-deep-blue">
              Home
            </Link>
            <Link href="/categories/Politics" className="hover:text-deep-blue">
              Politics
            </Link>
            <Link href="/categories/Economy" className="hover:text-deep-blue">
              Economy
            </Link>
            <Link
              href="/categories/Technology"
              className="hover:text-deep-blue"
            >
              Tech
            </Link>
            <Link href="/categories/World" className="hover:text-deep-blue">
              World
            </Link>
            <Link href="/categories/Society" className="hover:text-deep-blue">
              Society
            </Link>
          </nav>
          {session ? (
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline text-sm text-gray-600">
                {session.user?.name}
              </span>
              <button
                onClick={() => signOut()}
                className="rounded border border-deep-blue px-3 py-2 text-sm text-deep-blue hover:bg-deep-blue hover:text-white transition"
              >
                Sign out
              </button>
            </div>
          ) : (
            <button
              onClick={() => signIn("google")}
              className="rounded bg-deep-blue px-4 py-2 text-sm text-white hover:bg-blue-800 transition"
            >
              Sign in with Google
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
