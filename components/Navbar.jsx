'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { MessageSquareQuote, Plus, User, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function Navbar({ onAddQuote }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isSignedIn, isLoaded, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = async () => {
    await logout();
    setMenuOpen(false);
    router.push('/');
  };

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : '';

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
            <MessageSquareQuote size={14} className="text-white" />
          </div>
          <span className="font-semibold text-gray-900">QuoteFlow</span>
        </Link>

        <div className="flex items-center gap-6">
          <Link
            href="/"
            className={`text-sm ${pathname === '/' ? 'text-primary font-medium' : 'text-gray-600 hover:text-gray-900'}`}
          >
            Home
          </Link>
          <Link
            href="/quotes"
            className={`text-sm ${pathname.startsWith('/quotes') ? 'text-primary font-medium' : 'text-gray-600 hover:text-gray-900'}`}
          >
            Quotes
          </Link>

          {/* Avoid flashing the wrong state before the auth check resolves */}
          {!isLoaded ? (
            <div className="w-20 h-7 rounded-lg bg-gray-100 animate-pulse" />
          ) : isSignedIn ? (
            <>
              <button
                onClick={onAddQuote}
                className="bg-primary text-white text-sm px-4 py-1.5 rounded-lg flex items-center gap-1.5 hover:bg-primary-dark transition-colors"
              >
                <Plus size={14} /> Add Quote
              </button>

              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen((o) => !o)}
                  className="w-8 h-8 rounded-full bg-primary/20 text-primary font-semibold text-xs flex items-center justify-center hover:bg-primary/30 transition-colors"
                  title={user?.name}
                >
                  {initials || <User size={14} />}
                </button>
                {menuOpen && (
                  <div className="absolute right-0 top-10 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 w-48 z-50 text-sm">
                    <div className="px-3 py-2 border-b border-gray-50">
                      <p className="font-medium text-gray-900 truncate">{user?.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-gray-50 text-gray-700 transition-colors"
                    >
                      <LogOut size={14} /> Sign out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <Link
              href="/sign-in"
              className="bg-primary text-white text-sm px-4 py-1.5 rounded-lg hover:bg-primary-dark transition-colors"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
